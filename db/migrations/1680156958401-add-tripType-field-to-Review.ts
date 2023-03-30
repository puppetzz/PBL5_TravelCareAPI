import { MigrationInterface, QueryRunner } from "typeorm";

export class addTripTypeFieldToReview1680156958401 implements MigrationInterface {
    name = 'addTripTypeFieldToReview1680156958401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ADD "tripTypeId" character varying`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87" UNIQUE ("tripTypeId")`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-30T06:15:59.708Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-03-30T06:15:59.711Z'`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87" FOREIGN KEY ("tripTypeId") REFERENCES "trip_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-03-30 06:08:22.918'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-30 06:08:22.915'`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "tripTypeId"`);
    }

}
