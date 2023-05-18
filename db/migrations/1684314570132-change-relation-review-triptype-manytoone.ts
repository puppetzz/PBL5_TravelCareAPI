import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRelationReviewTriptypeManytoone1684314570132 implements MigrationInterface {
    name = 'ChangeRelationReviewTriptypeManytoone1684314570132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-17T09:09:30.756Z'`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-17T09:09:30.892Z'`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-17T09:09:30.901Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-17T09:09:30.901Z'`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87" FOREIGN KEY ("tripTypeId") REFERENCES "trip_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16 10:34:25.236'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16 10:34:25.236'`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "UQ_b4e9d4998a69f9a84693757eb87" UNIQUE ("tripTypeId")`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-16 10:34:25.231'`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_b4e9d4998a69f9a84693757eb87" FOREIGN KEY ("tripTypeId") REFERENCES "trip_type"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16 10:34:25.095'`);
    }

}
