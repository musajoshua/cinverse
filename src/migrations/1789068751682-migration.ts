import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789068751682 implements MigrationInterface {
    name = 'Migration1789068751682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" text NOT NULL, "movieId" uuid, "userId" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_e50936dfdefcaf083d446baca11" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_e50936dfdefcaf083d446baca11"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
