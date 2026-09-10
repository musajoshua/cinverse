import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789074644190 implements MigrationInterface {
    name = 'Migration1789074644190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ADD "averageRating" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "averageRating"`);
    }

}
