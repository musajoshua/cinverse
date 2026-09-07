import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788820427440 implements MigrationInterface {
    name = 'Migration1788820427440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movies_genres" ("moviesId" uuid NOT NULL, "genresId" uuid NOT NULL, CONSTRAINT "PK_a5d3ebb8cdde7f76f199db8d1c9" PRIMARY KEY ("moviesId", "genresId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_490f84585d33963d5d7bdc34ec" ON "movies_genres"  ("moviesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_91d9e376de22a2324b93d6eae6" ON "movies_genres"  ("genresId") `);
        await queryRunner.query(`CREATE TABLE "movies_actors" ("moviesId" uuid NOT NULL, "actorsId" uuid NOT NULL, CONSTRAINT "PK_737702849f658093632f35b622d" PRIMARY KEY ("moviesId", "actorsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d8b1b832dc2097cddfd6e9ef32" ON "movies_actors"  ("moviesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7e36ac9a9ca0e920c39c4c7f45" ON "movies_actors"  ("actorsId") `);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "genres"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "actors"`);
        await queryRunner.query(`ALTER TABLE "actors" DROP COLUMN "filmography"`);
        await queryRunner.query(`ALTER TABLE "movies_genres" ADD CONSTRAINT "FK_490f84585d33963d5d7bdc34ec6" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movies_genres" ADD CONSTRAINT "FK_91d9e376de22a2324b93d6eae62" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movies_actors" ADD CONSTRAINT "FK_d8b1b832dc2097cddfd6e9ef324" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movies_actors" ADD CONSTRAINT "FK_7e36ac9a9ca0e920c39c4c7f454" FOREIGN KEY ("actorsId") REFERENCES "actors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies_actors" DROP CONSTRAINT "FK_7e36ac9a9ca0e920c39c4c7f454"`);
        await queryRunner.query(`ALTER TABLE "movies_actors" DROP CONSTRAINT "FK_d8b1b832dc2097cddfd6e9ef324"`);
        await queryRunner.query(`ALTER TABLE "movies_genres" DROP CONSTRAINT "FK_91d9e376de22a2324b93d6eae62"`);
        await queryRunner.query(`ALTER TABLE "movies_genres" DROP CONSTRAINT "FK_490f84585d33963d5d7bdc34ec6"`);
        await queryRunner.query(`ALTER TABLE "actors" ADD "filmography" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "actors" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "genres" text array NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e36ac9a9ca0e920c39c4c7f45"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d8b1b832dc2097cddfd6e9ef32"`);
        await queryRunner.query(`DROP TABLE "movies_actors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91d9e376de22a2324b93d6eae6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_490f84585d33963d5d7bdc34ec"`);
        await queryRunner.query(`DROP TABLE "movies_genres"`);
    }

}
