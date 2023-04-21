import { MigrationInterface, QueryRunner } from "typeorm";

export class addImageUrlFieldUser1682086709163 implements MigrationInterface {
    name = 'addImageUrlFieldUser1682086709163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "reviewAt"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "updateAt"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "reviewDate" TIMESTAMP NOT NULL DEFAULT '2023-04-21T14:18:29.730Z'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coverImageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T14:18:29.654Z'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T14:18:29.736Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T14:18:29.736Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 13:11:21.477'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 13:11:21.476'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 13:11:21.313'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coverImageUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImageUrl"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "reviewDate"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "updateAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "review" ADD "reviewAt" TIMESTAMP NOT NULL DEFAULT '2023-04-21 13:11:21.47'`);
    }

}
