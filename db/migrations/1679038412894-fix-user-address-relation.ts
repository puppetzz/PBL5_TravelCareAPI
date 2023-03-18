import { MigrationInterface, QueryRunner } from "typeorm";

export class fixUserAddressRelation1679038412894 implements MigrationInterface {
    name = 'fixUserAddressRelation1679038412894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "addressId" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271" UNIQUE ("addressId")`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17T07:33:33.225Z'`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17 06:50:15.108'`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "addressId"`);
    }

}
