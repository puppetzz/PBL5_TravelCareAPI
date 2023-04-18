import { MigrationInterface, QueryRunner } from "typeorm";

export class updateNullableForAddressProvinceDistrictWard1681835638795 implements MigrationInterface {
    name = 'updateNullableForAddressProvinceDistrictWard1681835638795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-18T16:33:59.857Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-18T16:33:59.950Z'`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_36a5ea1bf9f1a45fc696628bda2"`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "provinceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "districtId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "wardId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_36a5ea1bf9f1a45fc696628bda2" FOREIGN KEY ("wardId") REFERENCES "ward"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_36a5ea1bf9f1a45fc696628bda2"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3"`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "wardId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "districtId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "provinceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_36a5ea1bf9f1a45fc696628bda2" FOREIGN KEY ("wardId") REFERENCES "ward"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-18 06:03:43.175'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-18 06:03:43.172'`);
    }

}
