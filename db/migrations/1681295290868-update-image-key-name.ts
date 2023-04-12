import { MigrationInterface, QueryRunner } from "typeorm";

export class updateImageKeyName1681295290868 implements MigrationInterface {
    name = 'updateImageKeyName1681295290868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review_image" RENAME COLUMN "imageKey" TO "image"`);
        await queryRunner.query(`ALTER TABLE "location_image" RENAME COLUMN "imageKey" TO "image"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImageKey"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coverImageKey"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImage" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coverImage" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-12T10:28:11.779Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-12T10:28:11.933Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-11 02:36:52.602'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-11 02:36:52.6'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coverImage"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coverImageKey" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImageKey" character varying`);
        await queryRunner.query(`ALTER TABLE "location_image" RENAME COLUMN "image" TO "imageKey"`);
        await queryRunner.query(`ALTER TABLE "review_image" RENAME COLUMN "image" TO "imageKey"`);
    }

}
