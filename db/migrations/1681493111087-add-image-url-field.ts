import { MigrationInterface, QueryRunner } from "typeorm";

export class addImageUrlField1681493111087 implements MigrationInterface {
    name = 'addImageUrlField1681493111087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "location_image" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD "imageKey" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD "imageUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD "imageKey" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD "imageUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-14T17:25:11.699Z'`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_c9d7b40237cebf546efb44be330"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a"`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "trip_type" DROP CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39"`);
        await queryRunner.query(`ALTER TABLE "trip_type" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "trip_type" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "trip_type" ADD CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-14T17:25:11.702Z'`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "tripTypeId"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "tripTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87" UNIQUE ("tripTypeId")`);
        await queryRunner.query(`ALTER TABLE "location_image" DROP CONSTRAINT "PK_dfa981be0cd5c3c2f8c37915564"`);
        await queryRunner.query(`ALTER TABLE "location_image" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD CONSTRAINT "PK_dfa981be0cd5c3c2f8c37915564" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_26b6e9028d7c597535350b05bc4"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9" PRIMARY KEY ("locationId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9d7b40237cebf546efb44be33"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD "categoryId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_26b6e9028d7c597535350b05bc4" PRIMARY KEY ("locationId", "categoryId")`);
        await queryRunner.query(`CREATE INDEX "IDX_c9d7b40237cebf546efb44be33" ON "category_locations_location" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87" FOREIGN KEY ("tripTypeId") REFERENCES "trip_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_c9d7b40237cebf546efb44be330" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_c9d7b40237cebf546efb44be330"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c9d7b40237cebf546efb44be33"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_26b6e9028d7c597535350b05bc4"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9" PRIMARY KEY ("locationId")`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c9d7b40237cebf546efb44be33" ON "category_locations_location" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "PK_16c0a15a534e3f86e5dbf1757b9"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "PK_26b6e9028d7c597535350b05bc4" PRIMARY KEY ("categoryId", "locationId")`);
        await queryRunner.query(`ALTER TABLE "location_image" DROP CONSTRAINT "PK_dfa981be0cd5c3c2f8c37915564"`);
        await queryRunner.query(`ALTER TABLE "location_image" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD CONSTRAINT "PK_dfa981be0cd5c3c2f8c37915564" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "tripTypeId"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "tripTypeId" uuid`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87" UNIQUE ("tripTypeId")`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-13 13:19:52.053'`);
        await queryRunner.query(`ALTER TABLE "trip_type" DROP CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39"`);
        await queryRunner.query(`ALTER TABLE "trip_type" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "trip_type" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "trip_type" ADD CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87" FOREIGN KEY ("tripTypeId") REFERENCES "trip_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a"`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_c9d7b40237cebf546efb44be330" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-13 13:19:52.05'`);
        await queryRunner.query(`ALTER TABLE "location_image" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "location_image" DROP COLUMN "imageKey"`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "imageKey"`);
        await queryRunner.query(`ALTER TABLE "location_image" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD "image" character varying NOT NULL`);
    }

}
