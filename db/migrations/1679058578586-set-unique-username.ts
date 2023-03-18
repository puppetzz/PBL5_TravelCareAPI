import { MigrationInterface, QueryRunner } from "typeorm";

export class setUniqueUsername1679058578586 implements MigrationInterface {
    name = 'setUniqueUsername1679058578586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_41dfcb70af895ddf9a53094515b" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17T13:09:39.176Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17 11:24:46.755'`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_41dfcb70af895ddf9a53094515b"`);
    }

}
