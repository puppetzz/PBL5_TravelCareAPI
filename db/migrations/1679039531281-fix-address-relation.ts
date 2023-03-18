import { MigrationInterface, QueryRunner } from "typeorm";

export class fixAddressRelation1679039531281 implements MigrationInterface {
    name = 'fixAddressRelation1679039531281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17T07:52:11.634Z'`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda"`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "countryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "provinceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "districtId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9"`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "districtId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "provinceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "countryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17 07:33:33.225'`);
    }

}
