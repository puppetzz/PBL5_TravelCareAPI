import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWishlistTable1683567097085 implements MigrationInterface {
    name = 'AddWishlistTable1683567097085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wish_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userAccountId" character varying, "locationId" uuid, CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08T17:31:37.924Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-08T17:31:38.067Z'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08T17:31:38.076Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08T17:31:38.076Z'`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_2512b2bd78ab4b34770c1a2bb11" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_2512b2bd78ab4b34770c1a2bb11"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_5ba983ebb5aca691996c38ccfb2"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 17:11:54.141'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 17:11:54.141'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-04-21 17:11:54.132'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 17:11:54.129'`);
        await queryRunner.query(`DROP TABLE "wish_list"`);
    }

}
