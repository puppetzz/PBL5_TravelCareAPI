import { MigrationInterface, QueryRunner } from "typeorm";

export class integrateLocation1680123310271 implements MigrationInterface {
    name = 'integrateLocation1680123310271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" character varying NOT NULL, "name" character varying NOT NULL, "rating" numeric(2,1) NOT NULL DEFAULT '0', "About" character varying, "description" character varying, "isHotel" boolean NOT NULL DEFAULT false, "userAccountId" character varying, "addressId" character varying(10), CONSTRAINT "REL_f9c9f4fd8190f76a85d23bf1c6" UNIQUE ("addressId"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_locations_location" ("categoryId" character varying NOT NULL, "locationId" character varying NOT NULL, CONSTRAINT "PK_26b6e9028d7c597535350b05bc4" PRIMARY KEY ("categoryId", "locationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c9d7b40237cebf546efb44be33" ON "category_locations_location" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16c0a15a534e3f86e5dbf1757b" ON "category_locations_location" ("locationId") `);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-29T20:55:11.211Z'`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_f9c9f4fd8190f76a85d23bf1c6b" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_c9d7b40237cebf546efb44be330" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_c9d7b40237cebf546efb44be330"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_f9c9f4fd8190f76a85d23bf1c6b"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-24 14:52:44.643'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16c0a15a534e3f86e5dbf1757b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9d7b40237cebf546efb44be33"`);
        await queryRunner.query(`DROP TABLE "category_locations_location"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
