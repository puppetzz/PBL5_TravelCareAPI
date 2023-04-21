import { MigrationInterface, QueryRunner } from "typeorm";

export class addUpdateAtFieldForReviewAddImageUrlForUser1682097113367 implements MigrationInterface {
    name = 'addUpdateAtFieldForReviewAddImageUrlForUser1682097113367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "reviewDate"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "reviewAt" TIMESTAMP NOT NULL DEFAULT '2023-04-21T17:11:54.132Z'`);
        await queryRunner.query(`ALTER TABLE "review" ADD "updateAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coverImageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T17:11:54.129Z'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T17:11:54.141Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T17:11:54.141Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-04-20 18:18:10.62'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-04-20 18:18:10.62'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-20 18:18:10.608'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coverImageUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImageUrl"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "updateAt"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "reviewAt"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "reviewDate" TIMESTAMP NOT NULL DEFAULT '2023-04-20 18:18:10.614'`);
    }

}
