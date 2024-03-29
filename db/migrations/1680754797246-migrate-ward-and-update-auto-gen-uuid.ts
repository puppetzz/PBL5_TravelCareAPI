import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateWardAndUpdateAutoGenUuid1680754797246
  implements MigrationInterface
{
  name = 'migrateWardAndUpdateAutoGenUuid1680754797246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ward" ("id" character varying NOT NULL, "name" character varying NOT NULL, "districtId" character varying(10) NOT NULL, CONSTRAINT "PK_e6725fa4a50e449c4352d2230e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD "wardId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-06T04:19:57.905Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_c9d7b40237cebf546efb44be330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03"`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" DROP CONSTRAINT "FK_f0a1a48c40bcb0585f111015e5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" DROP CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a"`,
    );
    await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "review_image" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" ADD CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" DROP COLUMN "reviewId"`,
    );
    await queryRunner.query(`ALTER TABLE "review_image" ADD "reviewId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_type" DROP CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39"`,
    );
    await queryRunner.query(`ALTER TABLE "trip_type" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "trip_type" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_type" ADD CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_690a6193eae64156895920ddcd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_f54881daf6362511a79f3b323cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "PK_2e4299a343a81574217255c00ca"`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-06T04:19:58.064Z'`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "userAccountId"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "userAccountId" character varying(10)`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "locationId"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "locationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87"`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "tripTypeId"`);
    await queryRunner.query(`ALTER TABLE "review" ADD "tripTypeId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87" UNIQUE ("tripTypeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827"`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP COLUMN "userAccountId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD "userAccountId" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountId"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "accountId" character varying(10) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1" PRIMARY KEY ("accountId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_26b6e9028d7c597535350b05bc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9" PRIMARY KEY ("locationId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9d7b40237cebf546efb44be33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD "categoryId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_26b6e9028d7c597535350b05bc4" PRIMARY KEY ("locationId", "categoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_26b6e9028d7c597535350b05bc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_c9d7b40237cebf546efb44be330" PRIMARY KEY ("categoryId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_16c0a15a534e3f86e5dbf1757b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP COLUMN "locationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD "locationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_c9d7b40237cebf546efb44be330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_26b6e9028d7c597535350b05bc4" PRIMARY KEY ("categoryId", "locationId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9d7b40237cebf546efb44be33" ON "category_locations_location" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_16c0a15a534e3f86e5dbf1757b" ON "category_locations_location" ("locationId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" ADD CONSTRAINT "FK_f0a1a48c40bcb0585f111015e5a" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_690a6193eae64156895920ddcd3" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_f54881daf6362511a79f3b323cd" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87" FOREIGN KEY ("tripTypeId") REFERENCES "trip_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ward" ADD CONSTRAINT "FK_19a3bc9b3be291e8b9bc2bb623b" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_36a5ea1bf9f1a45fc696628bda2" FOREIGN KEY ("wardId") REFERENCES "ward"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_c9d7b40237cebf546efb44be330" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_c9d7b40237cebf546efb44be330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_36a5ea1bf9f1a45fc696628bda2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ward" DROP CONSTRAINT "FK_19a3bc9b3be291e8b9bc2bb623b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_f54881daf6362511a79f3b323cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_690a6193eae64156895920ddcd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" DROP CONSTRAINT "FK_f0a1a48c40bcb0585f111015e5a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_16c0a15a534e3f86e5dbf1757b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9d7b40237cebf546efb44be33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_26b6e9028d7c597535350b05bc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_c9d7b40237cebf546efb44be330" PRIMARY KEY ("categoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP COLUMN "locationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD "locationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_16c0a15a534e3f86e5dbf1757b" ON "category_locations_location" ("locationId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_c9d7b40237cebf546efb44be330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_26b6e9028d7c597535350b05bc4" PRIMARY KEY ("locationId", "categoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_26b6e9028d7c597535350b05bc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9" PRIMARY KEY ("locationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD "categoryId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9d7b40237cebf546efb44be33" ON "category_locations_location" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_26b6e9028d7c597535350b05bc4" PRIMARY KEY ("categoryId", "locationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountId"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "accountId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1" PRIMARY KEY ("accountId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP COLUMN "userAccountId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD "userAccountId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827"`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87"`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "tripTypeId"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "tripTypeId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87" UNIQUE ("tripTypeId")`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "locationId"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "locationId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "userAccountId"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "userAccountId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-03-30 06:32:46.835'`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "PK_2e4299a343a81574217255c00ca"`,
    );
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "review" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_f54881daf6362511a79f3b323cd" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_690a6193eae64156895920ddcd3" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_type" DROP CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39"`,
    );
    await queryRunner.query(`ALTER TABLE "trip_type" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "trip_type" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_type" ADD CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87" FOREIGN KEY ("tripTypeId") REFERENCES "trip_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" DROP COLUMN "reviewId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" ADD "reviewId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" DROP CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a"`,
    );
    await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "review_image" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" ADD CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_image" ADD CONSTRAINT "FK_f0a1a48c40bcb0585f111015e5a" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03"`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_c9d7b40237cebf546efb44be330" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-30 06:32:46.831'`,
    );
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "wardId"`);
    await queryRunner.query(`DROP TABLE "ward"`);
  }
}
