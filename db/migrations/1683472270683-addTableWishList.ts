import { MigrationInterface, QueryRunner } from "typeorm";

export class addTableWishList1683472270683 implements MigrationInterface {
    name = 'addTableWishList1683472270683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish_list" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07T15:11:11.152Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-07T15:11:11.230Z'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07T15:11:11.236Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07T15:11:11.237Z'`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2"`);
        await queryRunner.query(`ALTER TABLE "wish_list" ALTER COLUMN "userAccountId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2"`);
        await queryRunner.query(`ALTER TABLE "wish_list" ALTER COLUMN "userAccountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07 14:57:29.192'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07 14:57:29.192'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-07 14:57:29.186'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07 14:57:29.056'`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD "userId" character varying NOT NULL`);
    }

}
