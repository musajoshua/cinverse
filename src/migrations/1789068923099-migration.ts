import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789068923099 implements MigrationInterface {
    name = 'Migration1789068923099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_f7b3081fb3acdd8a17072bd8828" UNIQUE ("userId", "movieId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_f7b3081fb3acdd8a17072bd8828"`);
    }

}
