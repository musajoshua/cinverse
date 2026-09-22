<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">Built with <a href="http://nestjs.com" target="_blank">NestJS</a>, <a href="https://typeorm.io" target="_blank">TypeORM</a> and PostgreSQL.</p>

# Cinverse

A REST API for a movie catalog and review platform. It manages **movies, genres, actors, and reviews** with their relationships, and demonstrates production-style patterns: JWT authentication, role-based and resource-ownership authorization, request logging, filtering with pagination, and a denormalized average-rating aggregate.

## Features

- **Auth** — signup/signin with JWT; passwords hashed with bcrypt.
- **Authorization** — a global authentication guard, a role guard (`@USER_ROLES(ADMIN)`), and a resource-ownership guard (only a review's owner or an admin may edit/delete it).
- **Catalog** — movies with many-to-many `genres`/`actors`, and one-to-many `reviews`.
- **Reviews** — one review per user per movie (DB unique constraint); the author is taken from the JWT, never the request body.
- **Denormalized `averageRating`** — kept in sync on the movie whenever reviews change.
- **Filtering & pagination** — filter movies by `title`, `genre`, `actor`, `averageRating`; a custom pagination pipe (max `limit` of 50).
- **Cross-cutting** — request-logger middleware with an `x-request-id`, a response-transformer interceptor, and custom pipes/decorators.
- **Migrations** — TypeORM migrations (no `synchronize`), plus Docker Compose for Postgres.

## Tech stack

NestJS · TypeScript · TypeORM · PostgreSQL · JWT · class-validator · Docker Compose

## Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose (for Postgres)

## Getting started

```bash
git clone <your-repo-url>
cd Cinverse
npm install
```

Create a `.env` from the example and fill it in:

```bash
cp .env.example .env
```

```dotenv
DB_HOST=localhost        # localhost when running the app on your host; docker-compose overrides this to "cineverse-database" inside the container
DB_USERNAME=postgres
DB_PASSWORD=pass1234
DB_PORT=5432
DB_NAME=cineverse
SERVER_PORT=3000
```

### Option A — everything in Docker

```bash
docker compose up --build          # starts the API + Postgres
npm run migration:run              # apply migrations (from the host; Postgres port is published)
```

### Option B — Postgres in Docker, app on your host (fast dev loop)

```bash
docker compose up -d cineverse-database   # just the database
npm run migration:run                     # apply migrations
npm run start:dev                         # app with hot reload
```

The API is then available at `http://localhost:3000`.

## Database migrations

```bash
npm run migration:generate     # generate a migration from entity changes
npm run migration:run          # apply pending migrations
npm run migration:revert       # roll back the last migration
```

## API overview

| Resource | Endpoints | Access |
|---|---|---|
| Auth | `POST /auth/signup`, `POST /auth/signin` | Public |
| Movies | `GET /movies`, `GET /movies/:id` | Authenticated |
| Movies | `POST/PATCH/DELETE /movies` | Admin only |
| Genres | `POST/GET/PATCH/DELETE /genres` | Authenticated |
| Actors | `POST/GET/PATCH/DELETE /actors` | Authenticated |
| Reviews | `GET /reviews`, `GET /reviews/:id`, `POST /reviews` | Authenticated |
| Reviews | `PATCH/DELETE /reviews/:id` | Owner or admin |

Authenticated routes expect an `Authorization: Bearer <token>` header (get a token from `POST /auth/signin`).

**Movie query params:** `?title=&genre=&actor=&averageRating=&limit=&offset=` (`limit` is capped at 50).

## Example requests

Sign in and get a token:

```bash
curl -s -X POST http://localhost:3000/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"Passw0rd!23"}'
# → { "id": "...", "email": "...", "token": "<JWT>" }
```

List movies with a filter + pagination (auth required):

```bash
curl -s 'http://localhost:3000/movies?genre=Action&limit=10&offset=0' \
  -H 'Authorization: Bearer <JWT>'
```

Create a review — the author is taken from the token, not the body:

```bash
curl -s -X POST http://localhost:3000/reviews \
  -H 'Authorization: Bearer <JWT>' \
  -H 'Content-Type: application/json' \
  -d '{"rating":5,"comment":"Loved it","movie":"<movieId>"}'
```

## Testing

**End-to-end smoke test** — exercises the whole API (auth, admin gating, ownership, pagination limits, filters, request-id, averageRating). Requires the app running and the `cineverse-database` container up (it promotes a temporary admin via the DB):

```bash
./test-api.sh                      # against http://localhost:3000
BASE_URL=http://localhost:4000 ./test-api.sh
```

**Postman** — import `cinverse.postman_collection.json` (folders for movies, genres, actors, reviews).

**Unit / e2e (Jest):**

```bash
npm run test
npm run test:e2e
```

## Project structure

```text
src/
├── main.ts                 # bootstrap + global ValidationPipe
├── app.module.ts           # root: wires guards, interceptors, middleware
├── config/                 # TypeORM DataSource for the migration CLI
├── migrations/             # TypeORM migrations
├── auth/                   # signup / signin, JWT issuing
├── users/                  # user entity + service
├── movies/                 # movies (M:N genres/actors, 1:N reviews) + filtering
├── genres/                 # genres
├── actors/                 # actors
├── reviews/                # reviews (ownership guard, unique per user+movie, avg sync)
└── common/
    ├── decorators/         # @CurrentUser, @USER_ROLES, @IS_PUBLIC
    ├── guards/             # AuthNGuard (authenticate), RoleGuard (authorize)
    ├── interceptors/       # response transformer
    ├── middlewares/        # request logger (x-request-id)
    ├── pipes/              # pagination validation (max limit 50)
    ├── types/              # Express.Request augmentation (user, requestId)
    └── enums/ · interface/ · pagination/
```

Each feature module follows the same shape: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/`.

## License

Released under the [MIT License](LICENSE).
