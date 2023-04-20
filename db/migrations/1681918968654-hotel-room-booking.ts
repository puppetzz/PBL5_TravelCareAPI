import { MigrationInterface, QueryRunner } from "typeorm";

export class hotelRoomBooking1681918968654 implements MigrationInterface {
    name = 'hotelRoomBooking1681918968654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotel_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" character varying NOT NULL, "imageKey" character varying NOT NULL, "hotelId" uuid, CONSTRAINT "PK_9d5ff18f4d680a90b873fd7ed62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_amenity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9a5289e5f83bc78d0dbf997a56f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_style" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_52239cf25eaead597a583e26766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discount" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "start" TIMESTAMP NOT NULL, "end" TIMESTAMP NOT NULL, "discountPercent" numeric(5,2) NOT NULL, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_feature" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_06829e5737733d39a047f775a66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_abd0f8a4c8a444a84fa2b343353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bed" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_828b3f79eab8a8b1de6b6ed6c5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_bed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "numberOfBeds" integer NOT NULL, "bedId" integer, "roomId" uuid, CONSTRAINT "PK_d33f70beb50b65290ac1ad409ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "receipt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP NOT NULL DEFAULT '2023-04-19T15:42:49.788Z', "bookingId" uuid NOT NULL, "userAccountId" character varying, CONSTRAINT "REL_b726e4d7dbf11f75a28b0ca4cb" UNIQUE ("bookingId"), CONSTRAINT "PK_b4b9ec7d164235fbba023da9832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checkIn" TIMESTAMP NOT NULL, "checkOut" TIMESTAMP NOT NULL, "numberOfRooms" integer NOT NULL, "isFreeCancel" boolean NOT NULL DEFAULT false, "freeCancelDueDate" TIMESTAMP NOT NULL, "cancellationPay" numeric(5,2) NOT NULL DEFAULT '0', "refund" numeric(5,3) NOT NULL DEFAULT '0', "isPaid" boolean NOT NULL DEFAULT false, "createAt" TIMESTAMP NOT NULL DEFAULT '2023-04-19T15:42:49.788Z', "updateAt" TIMESTAMP, "userAccountId" character varying, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" integer NOT NULL, "numberOfRooms" integer NOT NULL, "avaliableRooms" integer NOT NULL DEFAULT '0', "sleeps" integer NOT NULL, "isPrepay" boolean NOT NULL DEFAULT false, "hotelId" uuid, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "website" character varying, "hotelClass" integer NOT NULL DEFAULT '1', "locationId" uuid, CONSTRAINT "REL_22c5949683d16332ed263ed097" UNIQUE ("locationId"), CONSTRAINT "PK_3a62ac86b369b36c1a297e9ab26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking_rooms_room" ("bookingId" uuid NOT NULL, "roomId" uuid NOT NULL, CONSTRAINT "PK_a0b509c26a53b6c21c5d3339a97" PRIMARY KEY ("bookingId", "roomId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8f1a8045893e516c9e6a74c1cb" ON "booking_rooms_room" ("bookingId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f002f6e24167ea10d48ad286b6" ON "booking_rooms_room" ("roomId") `);
        await queryRunner.query(`CREATE TABLE "room_discounts_discount" ("roomId" uuid NOT NULL, "discountId" uuid NOT NULL, CONSTRAINT "PK_7fa43b07bd54009675086b06b03" PRIMARY KEY ("roomId", "discountId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d1241f290f3a60ac8169c1718c" ON "room_discounts_discount" ("roomId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aff631de915da791dc64bced58" ON "room_discounts_discount" ("discountId") `);
        await queryRunner.query(`CREATE TABLE "room_room_features_room_feature" ("roomId" uuid NOT NULL, "roomFeatureId" integer NOT NULL, CONSTRAINT "PK_379ccbfb1b706c0014f653870e2" PRIMARY KEY ("roomId", "roomFeatureId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f8b1acbd9e3fc084c43734bd9" ON "room_room_features_room_feature" ("roomId") `);
        await queryRunner.query(`CREATE INDEX "IDX_144c973be949a5ea0b81fc16d7" ON "room_room_features_room_feature" ("roomFeatureId") `);
        await queryRunner.query(`CREATE TABLE "room_room_types_room_type" ("roomId" uuid NOT NULL, "roomTypeId" integer NOT NULL, CONSTRAINT "PK_090c4a3b7469fb4cd3d9df38475" PRIMARY KEY ("roomId", "roomTypeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a7acd938565a8daf63a8f352f4" ON "room_room_types_room_type" ("roomId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ae9dfc32226d4bdd53353f052" ON "room_room_types_room_type" ("roomTypeId") `);
        await queryRunner.query(`CREATE TABLE "hotel_property_amenities_property_amenity" ("hotelId" uuid NOT NULL, "propertyAmenityId" integer NOT NULL, CONSTRAINT "PK_f1d5ba5e12b8dfc56db6089307a" PRIMARY KEY ("hotelId", "propertyAmenityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a125ce628f13d8dcd15115e4f8" ON "hotel_property_amenities_property_amenity" ("hotelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4b88b59f78c111f3064df52dc1" ON "hotel_property_amenities_property_amenity" ("propertyAmenityId") `);
        await queryRunner.query(`CREATE TABLE "hotel_hotel_styles_hotel_style" ("hotelId" uuid NOT NULL, "hotelStyleId" integer NOT NULL, CONSTRAINT "PK_e01e5044f67ff743dc0a547b8e8" PRIMARY KEY ("hotelId", "hotelStyleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_93515c2b2a5f607992c8b2ae00" ON "hotel_hotel_styles_hotel_style" ("hotelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6e80d671f4494cd4c00033f5d" ON "hotel_hotel_styles_hotel_style" ("hotelStyleId") `);
        await queryRunner.query(`CREATE TABLE "hotel_languages_language" ("hotelId" uuid NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_514ec5d15404c272bb17e01543c" PRIMARY KEY ("hotelId", "languageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5a64c43ef376ca545f95afd920" ON "hotel_languages_language" ("hotelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8457bf1103d317e3a87aeefd39" ON "hotel_languages_language" ("languageId") `);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-19T15:42:49.770Z'`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a"`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-19T15:42:49.776Z'`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "streetAddress" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hotel_image" ADD CONSTRAINT "FK_569d986e9d34248d795e427a33c" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_bed" ADD CONSTRAINT "FK_2f701a2444a9499a40659442b80" FOREIGN KEY ("bedId") REFERENCES "bed"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_bed" ADD CONSTRAINT "FK_67147ea15fd6f2c8752c372a0c1" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_b726e4d7dbf11f75a28b0ca4cba" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_763149a663b51bd27366531c2ed" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_484b25a2f3c7b52b8f7e08a73ac" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_2fac52abaa01b54156539cad11c" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel" ADD CONSTRAINT "FK_22c5949683d16332ed263ed0970" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "booking_rooms_room" ADD CONSTRAINT "FK_8f1a8045893e516c9e6a74c1cb6" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "booking_rooms_room" ADD CONSTRAINT "FK_f002f6e24167ea10d48ad286b6b" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_discounts_discount" ADD CONSTRAINT "FK_d1241f290f3a60ac8169c1718cd" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_discounts_discount" ADD CONSTRAINT "FK_aff631de915da791dc64bced58a" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_room_features_room_feature" ADD CONSTRAINT "FK_7f8b1acbd9e3fc084c43734bd9b" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_room_features_room_feature" ADD CONSTRAINT "FK_144c973be949a5ea0b81fc16d77" FOREIGN KEY ("roomFeatureId") REFERENCES "room_feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_room_types_room_type" ADD CONSTRAINT "FK_a7acd938565a8daf63a8f352f41" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_room_types_room_type" ADD CONSTRAINT "FK_6ae9dfc32226d4bdd53353f052a" FOREIGN KEY ("roomTypeId") REFERENCES "room_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_property_amenities_property_amenity" ADD CONSTRAINT "FK_a125ce628f13d8dcd15115e4f8e" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hotel_property_amenities_property_amenity" ADD CONSTRAINT "FK_4b88b59f78c111f3064df52dc1f" FOREIGN KEY ("propertyAmenityId") REFERENCES "property_amenity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_hotel_styles_hotel_style" ADD CONSTRAINT "FK_93515c2b2a5f607992c8b2ae000" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hotel_hotel_styles_hotel_style" ADD CONSTRAINT "FK_c6e80d671f4494cd4c00033f5d0" FOREIGN KEY ("hotelStyleId") REFERENCES "hotel_style"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_languages_language" ADD CONSTRAINT "FK_5a64c43ef376ca545f95afd9208" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hotel_languages_language" ADD CONSTRAINT "FK_8457bf1103d317e3a87aeefd39e" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_languages_language" DROP CONSTRAINT "FK_8457bf1103d317e3a87aeefd39e"`);
        await queryRunner.query(`ALTER TABLE "hotel_languages_language" DROP CONSTRAINT "FK_5a64c43ef376ca545f95afd9208"`);
        await queryRunner.query(`ALTER TABLE "hotel_hotel_styles_hotel_style" DROP CONSTRAINT "FK_c6e80d671f4494cd4c00033f5d0"`);
        await queryRunner.query(`ALTER TABLE "hotel_hotel_styles_hotel_style" DROP CONSTRAINT "FK_93515c2b2a5f607992c8b2ae000"`);
        await queryRunner.query(`ALTER TABLE "hotel_property_amenities_property_amenity" DROP CONSTRAINT "FK_4b88b59f78c111f3064df52dc1f"`);
        await queryRunner.query(`ALTER TABLE "hotel_property_amenities_property_amenity" DROP CONSTRAINT "FK_a125ce628f13d8dcd15115e4f8e"`);
        await queryRunner.query(`ALTER TABLE "room_room_types_room_type" DROP CONSTRAINT "FK_6ae9dfc32226d4bdd53353f052a"`);
        await queryRunner.query(`ALTER TABLE "room_room_types_room_type" DROP CONSTRAINT "FK_a7acd938565a8daf63a8f352f41"`);
        await queryRunner.query(`ALTER TABLE "room_room_features_room_feature" DROP CONSTRAINT "FK_144c973be949a5ea0b81fc16d77"`);
        await queryRunner.query(`ALTER TABLE "room_room_features_room_feature" DROP CONSTRAINT "FK_7f8b1acbd9e3fc084c43734bd9b"`);
        await queryRunner.query(`ALTER TABLE "room_discounts_discount" DROP CONSTRAINT "FK_aff631de915da791dc64bced58a"`);
        await queryRunner.query(`ALTER TABLE "room_discounts_discount" DROP CONSTRAINT "FK_d1241f290f3a60ac8169c1718cd"`);
        await queryRunner.query(`ALTER TABLE "booking_rooms_room" DROP CONSTRAINT "FK_f002f6e24167ea10d48ad286b6b"`);
        await queryRunner.query(`ALTER TABLE "booking_rooms_room" DROP CONSTRAINT "FK_8f1a8045893e516c9e6a74c1cb6"`);
        await queryRunner.query(`ALTER TABLE "hotel" DROP CONSTRAINT "FK_22c5949683d16332ed263ed0970"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_2fac52abaa01b54156539cad11c"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_484b25a2f3c7b52b8f7e08a73ac"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_763149a663b51bd27366531c2ed"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_b726e4d7dbf11f75a28b0ca4cba"`);
        await queryRunner.query(`ALTER TABLE "room_bed" DROP CONSTRAINT "FK_67147ea15fd6f2c8752c372a0c1"`);
        await queryRunner.query(`ALTER TABLE "room_bed" DROP CONSTRAINT "FK_2f701a2444a9499a40659442b80"`);
        await queryRunner.query(`ALTER TABLE "hotel_image" DROP CONSTRAINT "FK_569d986e9d34248d795e427a33c"`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "streetAddress" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-18 16:33:59.95'`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a"`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-18 16:33:59.857'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8457bf1103d317e3a87aeefd39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a64c43ef376ca545f95afd920"`);
        await queryRunner.query(`DROP TABLE "hotel_languages_language"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6e80d671f4494cd4c00033f5d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93515c2b2a5f607992c8b2ae00"`);
        await queryRunner.query(`DROP TABLE "hotel_hotel_styles_hotel_style"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b88b59f78c111f3064df52dc1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a125ce628f13d8dcd15115e4f8"`);
        await queryRunner.query(`DROP TABLE "hotel_property_amenities_property_amenity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ae9dfc32226d4bdd53353f052"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7acd938565a8daf63a8f352f4"`);
        await queryRunner.query(`DROP TABLE "room_room_types_room_type"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_144c973be949a5ea0b81fc16d7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f8b1acbd9e3fc084c43734bd9"`);
        await queryRunner.query(`DROP TABLE "room_room_features_room_feature"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aff631de915da791dc64bced58"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1241f290f3a60ac8169c1718c"`);
        await queryRunner.query(`DROP TABLE "room_discounts_discount"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f002f6e24167ea10d48ad286b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f1a8045893e516c9e6a74c1cb"`);
        await queryRunner.query(`DROP TABLE "booking_rooms_room"`);
        await queryRunner.query(`DROP TABLE "hotel"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "receipt"`);
        await queryRunner.query(`DROP TABLE "room_bed"`);
        await queryRunner.query(`DROP TABLE "bed"`);
        await queryRunner.query(`DROP TABLE "room_type"`);
        await queryRunner.query(`DROP TABLE "room_feature"`);
        await queryRunner.query(`DROP TABLE "discount"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "hotel_style"`);
        await queryRunner.query(`DROP TABLE "property_amenity"`);
        await queryRunner.query(`DROP TABLE "hotel_image"`);
    }

}