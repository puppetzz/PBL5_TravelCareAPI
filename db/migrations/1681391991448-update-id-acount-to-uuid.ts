import { MigrationInterface, QueryRunner } from "typeorm";

export class updateIdAcountToUuid1681391991448 implements MigrationInterface {
    name = 'updateIdAcountToUuid1681391991448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-13T13:19:52.050Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-13T13:19:52.053Z'`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-12 10:28:11.933'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-12 10:28:11.779'`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "id" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
