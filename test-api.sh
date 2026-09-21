#!/usr/bin/env bash
#
# End-to-end smoke test for the Cinverse API using curl.
#
# Prereqs:
#   - App running (npm run start:dev, or docker compose up)
#   - Postgres reachable as the "cineverse-database" Docker container
#     (only needed to promote a user to admin; see ADMIN section)
#
# Usage:
#   chmod +x test-api.sh
#   ./test-api.sh                      # against http://localhost:3000
#   BASE_URL=http://localhost:4000 ./test-api.sh
#
# It exits non-zero if any assertion fails.

set -uo pipefail
BASE_URL="${BASE_URL:-http://localhost:3000}"
DB_CONTAINER="${DB_CONTAINER:-cineverse-database}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-cineverse}"
RUN="$(date +%s)"                       # unique suffix so re-runs don't collide
FAILED=0

# --- helpers -----------------------------------------------------------------
# req METHOD PATH [TOKEN] [JSON_BODY]  -> sets $HTTP_CODE and $BODY
req() {
  local method="$1" path="$2" token="${3:-}" body="${4:-}"
  local args=(-s -w $'\n%{http_code}' -X "$method" "$BASE_URL$path" -H 'Content-Type: application/json')
  [ -n "$token" ] && args+=(-H "Authorization: Bearer $token")
  [ -n "$body" ]  && args+=(-d "$body")
  local out; out="$(curl "${args[@]}")"
  HTTP_CODE="${out##*$'\n'}"
  BODY="${out%$'\n'*}"
}

check() {  # check EXPECTED_CODE "label"
  if [ "$HTTP_CODE" = "$1" ]; then
    echo "  ✅ $2 ($HTTP_CODE)"
  else
    echo "  ❌ $2 — expected $1, got $HTTP_CODE :: $BODY"
    FAILED=1
  fi
}

json() { echo "$BODY" | grep -oE "\"$1\":\"[^\"]+\"" | head -1 | sed -E "s/.*:\"([^\"]+)\"/\1/"; }

section() { echo; echo "=== $1 ==="; }

# --- AUTH --------------------------------------------------------------------
section "Auth: signup + signin"
USER_EMAIL="user_${RUN}@test.com"
USER2_EMAIL="user2_${RUN}@test.com"
ADMIN_EMAIL="admin_${RUN}@test.com"
PW='Passw0rd!23'

req POST /auth/signup "" "{\"email\":\"$USER_EMAIL\",\"password\":\"$PW\",\"confirmPassword\":\"$PW\"}"
check 201 "signup user1"
req POST /auth/signin "" "{\"email\":\"$USER_EMAIL\",\"password\":\"$PW\"}"
check 201 "signin user1"; USER_TOKEN="$(echo "$BODY" | grep -oE '"token":"[^"]+"' | sed -E 's/.*:"([^"]+)"/\1/')"

req POST /auth/signup "" "{\"email\":\"$USER2_EMAIL\",\"password\":\"$PW\",\"confirmPassword\":\"$PW\"}"
check 201 "signup user2 (non-owner)"
req POST /auth/signin "" "{\"email\":\"$USER2_EMAIL\",\"password\":\"$PW\"}"
check 201 "signin user2"; USER2_TOKEN="$(echo "$BODY" | grep -oE '"token":"[^"]+"' | sed -E 's/.*:"([^"]+)"/\1/')"

req POST /auth/signin "" "{\"email\":\"$USER_EMAIL\",\"password\":\"wrong\"}"
check 400 "signin with wrong password rejected"

# --- ADMIN (promote in DB, then re-login for a token that carries role) ------
section "Admin bootstrap"
req POST /auth/signup "" "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$PW\",\"confirmPassword\":\"$PW\"}"
check 201 "signup admin"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
  -c "UPDATE users SET role='admin' WHERE email='$ADMIN_EMAIL';" >/dev/null 2>&1 \
  && echo "  ✅ promoted $ADMIN_EMAIL to admin" || { echo "  ❌ could not promote admin (is the DB container '$DB_CONTAINER' up?)"; FAILED=1; }
req POST /auth/signin "" "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$PW\"}"
check 201 "signin admin (token now carries role=admin)"; ADMIN_TOKEN="$(echo "$BODY" | grep -oE '"token":"[^"]+"' | sed -E 's/.*:"([^"]+)"/\1/')"

# --- AUTH GUARD (no token / bad token) ---------------------------------------
section "Global auth guard"
req GET /movies ""
check 401 "GET /movies without token -> 401"
req GET /movies "not-a-real-token"
check 401 "GET /movies with bad token -> 401"

# --- GENRES (any authenticated user) -----------------------------------------
section "Genres"
req POST /genres "$USER_TOKEN" "{\"name\":\"Action_${RUN}\",\"description\":\"High energy\"}"
check 201 "create genre"; GENRE_ID="$(json id)"
req GET /genres "$USER_TOKEN"; check 200 "list genres"
req GET "/genres/$GENRE_ID" "$USER_TOKEN"; check 200 "get genre by id"

# --- ACTORS ------------------------------------------------------------------
section "Actors"
req POST /actors "$USER_TOKEN" "{\"name\":\"Actor ${RUN}\",\"dateOfBirth\":\"1974-11-11\"}"
check 201 "create actor"; ACTOR_ID="$(json id)"

# --- MOVIES: admin gating ----------------------------------------------------
section "Movies: admin gating"
MOVIE_BODY="{\"title\":\"Inception ${RUN}\",\"description\":\"Dreams\",\"releaseDate\":\"2010-07-16\",\"genres\":[\"$GENRE_ID\"],\"actors\":[\"$ACTOR_ID\"],\"posterImage\":\"http://x/p.jpg\",\"trailerLink\":\"http://x/t.mp4\"}"
req POST /movies "" "$MOVIE_BODY";           check 401 "create movie, no token -> 401"
req POST /movies "$USER_TOKEN" "$MOVIE_BODY"; check 403 "create movie as non-admin -> 403"
req POST /movies "$ADMIN_TOKEN" "$MOVIE_BODY"; check 201 "create movie as admin -> 201"; MOVIE_ID="$(json id)"

# --- MOVIES: reads, filters, pagination pipe ---------------------------------
section "Movies: reads / filters / pagination"
req GET /movies "$USER_TOKEN";                                  check 200 "list movies (authenticated)"
req GET "/movies?title=Inception&limit=5&offset=0" "$USER_TOKEN"; check 200 "filter by title + paginate"
req GET "/movies?genre=Action&actor=Actor&averageRating=1" "$USER_TOKEN"; check 200 "filter by genre/actor/rating"
req GET "/movies/$MOVIE_ID" "$USER_TOKEN";                      check 200 "get movie by id"
req GET "/movies?limit=100" "$USER_TOKEN";                      check 400 "limit>50 rejected by pipe -> 400"
req GET "/movies?limit=abc" "$USER_TOKEN";                      check 400 "non-numeric limit rejected -> 400"

# --- MOVIES: update/delete (admin) -------------------------------------------
section "Movies: update/delete"
req PATCH "/movies/$MOVIE_ID" "$USER_TOKEN" "{\"title\":\"Hacked\"}"; check 403 "update movie as non-admin -> 403"
req PATCH "/movies/$MOVIE_ID" "$ADMIN_TOKEN" "{\"title\":\"Inception (Director's Cut)\"}"; check 200 "update movie as admin -> 200"

# --- REVIEWS -----------------------------------------------------------------
section "Reviews: create / duplicate / ownership"
req POST /reviews "$USER_TOKEN" "{\"rating\":5,\"comment\":\"Great\",\"movie\":\"$MOVIE_ID\"}"
check 201 "user1 creates review (author from token)"; REVIEW_ID="$(json id)"
req POST /reviews "$USER_TOKEN" "{\"rating\":4,\"comment\":\"Again\",\"movie\":\"$MOVIE_ID\"}"
check 409 "duplicate review by same user -> 409"
req GET "/reviews?movieId=$MOVIE_ID" "$USER_TOKEN"; check 200 "list reviews for a movie"

req PATCH "/reviews/$REVIEW_ID" "$USER2_TOKEN" "{\"rating\":1}"; check 403 "non-owner update -> 403 (ownership guard)"
req PATCH "/reviews/$REVIEW_ID" "$USER_TOKEN"  "{\"rating\":3}"; check 200 "owner update -> 200"
req PATCH "/reviews/$REVIEW_ID" "$ADMIN_TOKEN" "{\"comment\":\"admin edit\"}"; check 200 "admin update -> 200 (admin bypass)"

# --- averageRating denormalization -------------------------------------------
section "averageRating on movie reflects reviews"
req GET "/movies/$MOVIE_ID" "$USER_TOKEN"
if echo "$BODY" | grep -q '"averageRating"'; then echo "  ✅ movie carries averageRating :: $(echo "$BODY" | grep -oE '"averageRating":[0-9.]+')"; else echo "  ❌ averageRating missing"; FAILED=1; fi

# --- request-id header -------------------------------------------------------
section "Request-id middleware"
if curl -s -D - -o /dev/null "$BASE_URL/movies" -H "Authorization: Bearer $USER_TOKEN" | grep -qi 'x-request-id'; then
  echo "  ✅ response carries x-request-id header"
else
  echo "  ⚠️  no x-request-id on the response (middleware echoes it on req, not res?)"
fi

# --- cleanup -----------------------------------------------------------------
section "Cleanup (owner/admin deletes)"
req DELETE "/reviews/$REVIEW_ID" "$USER2_TOKEN"; check 403 "non-owner delete review -> 403"
req DELETE "/reviews/$REVIEW_ID" "$USER_TOKEN";  check 200 "owner delete review -> 200"
req DELETE "/movies/$MOVIE_ID" "$USER_TOKEN";    check 403 "delete movie as non-admin -> 403"
req DELETE "/movies/$MOVIE_ID" "$ADMIN_TOKEN";   check 200 "delete movie as admin -> 200"

# --- summary -----------------------------------------------------------------
echo
if [ "$FAILED" -eq 0 ]; then echo "🎬 ALL CHECKS PASSED"; else echo "❌ SOME CHECKS FAILED"; fi
exit "$FAILED"
