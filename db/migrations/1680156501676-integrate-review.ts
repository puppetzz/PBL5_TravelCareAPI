import { MigrationInterface, QueryRunner } from "typeorm";

export class integrateReview1680156501676 implements MigrationInterface {
    name = 'integrateReview1680156501676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review_image" ("id" character varying NOT NULL, "imageKey" character varying NOT NULL, "reviewId" character varying, CONSTRAINT "PK_953505a56c4a0c9b07726d2f09a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trip_type" ("id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b80a1e112ae33caa104b8fd0e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" character varying NOT NULL, "rating" numeric(2,1) NOT NULL DEFAULT '0', "reviewDate" TIMESTAMP NOT NULL DEFAULT '2023-03-30T06:08:22.918Z', "tripTime" TIMESTAMP NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "userAccountId" character varying, "locationId" character varying NOT NULL, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-30T06:08:22.915Z'`);
        await queryRunner.query(`ALTER TABLE "review_image" ADD CONSTRAINT "FK_f0a1a48c40bcb0585f111015e5a" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_690a6193eae64156895920ddcd3" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_f54881daf6362511a79f3b323cd" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_f54881daf6362511a79f3b323cd"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_690a6193eae64156895920ddcd3"`);
        await queryRunner.query(`ALTER TABLE "review_image" DROP CONSTRAINT "FK_f0a1a48c40bcb0585f111015e5a"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-29 20:55:11.211'`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "trip_type"`);
        await queryRunner.query(`DROP TABLE "review_image"`);
    }

}
