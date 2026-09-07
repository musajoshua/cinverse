import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788819489619 implements MigrationInterface {
    name = 'Migration1788819489619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "actors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "dateOfBirth" date NOT NULL, "filmography" text array NOT NULL, CONSTRAINT "PK_d8608598c2c4f907a78de2ae461" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "actors"`);
    }

}
