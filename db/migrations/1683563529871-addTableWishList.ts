import { MigrationInterface, QueryRunner } from "typeorm";

export class addTableWishList1683563529871 implements MigrationInterface {
    name = 'addTableWishList1683563529871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08T16:32:10.691Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-08T16:32:10.821Z'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08T16:32:10.827Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08T16:32:10.827Z'`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_2512b2bd78ab4b34770c1a2bb11"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "wish_list" ALTER COLUMN "userAccountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish_list" ALTER COLUMN "locationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_2512b2bd78ab4b34770c1a2bb11" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_2512b2bd78ab4b34770c1a2bb11"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2"`);
        await queryRunner.query(`ALTER TABLE "wish_list" ALTER COLUMN "locationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish_list" ALTER COLUMN "userAccountId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_2512b2bd78ab4b34770c1a2bb11" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07 15:11:11.237'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07 15:11:11.236'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-07 15:11:11.23'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-07 15:11:11.152'`);
    }

}
