import { MigrationInterface, QueryRunner } from "typeorm";

export class addLocationImageTable1681133584977 implements MigrationInterface {
    name = 'addLocationImageTable1681133584977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageKey" character varying NOT NULL, "locationId" uuid NOT NULL, CONSTRAINT "PK_dfa981be0cd5c3c2f8c37915564" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "about"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "imageCover"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "About" character varying`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-10T13:33:05.732Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-10T13:33:05.735Z'`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD CONSTRAINT "FK_b16e8454e89e24bd0aacc26b6d7" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_image" DROP CONSTRAINT "FK_b16e8454e89e24bd0aacc26b6d7"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-08 07:09:49.378'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-08 07:09:49.375'`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "About"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "imageCover" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "about" character varying`);
        await queryRunner.query(`DROP TABLE "location_image"`);
    }

}
