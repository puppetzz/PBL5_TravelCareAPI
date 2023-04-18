import { MigrationInterface, QueryRunner } from "typeorm";

export class updateNullableForAddressProvinceDistrictWard1681797822627 implements MigrationInterface {
    name = 'updateNullableForAddressProvinceDistrictWard1681797822627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-18T06:03:43.172Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-18T06:03:43.175Z'`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "streetAddress" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "streetAddress" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-18 05:29:09.207'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-18 05:29:09.2'`);
    }

}
