import { MigrationInterface, QueryRunner } from "typeorm";

export class updateUserProfile1681145222078 implements MigrationInterface {
    name = 'updateUserProfile1681145222078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImageKey" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coverImageKey" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "about" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-10T16:47:02.924Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-10T16:47:02.927Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-10 13:33:05.735'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-10 13:33:05.732'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "about"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coverImageKey"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImageKey"`);
    }

}
