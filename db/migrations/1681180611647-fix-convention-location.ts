import { MigrationInterface, QueryRunner } from "typeorm";

export class fixConventionLocation1681180611647 implements MigrationInterface {
    name = 'fixConventionLocation1681180611647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "About" TO "about"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-11T02:36:52.600Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-11T02:36:52.602Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-10 16:47:02.927'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-10 16:47:02.924'`);
        await queryRunner.query(`ALTER TABLE "location" RENAME COLUMN "about" TO "About"`);
    }

}
