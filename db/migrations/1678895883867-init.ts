import { MigrationInterface, QueryRunner } from "typeorm";

export class init1678895883867 implements MigrationInterface {
    name = 'init1678895883867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "district" ("id" character varying(10) NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "provinceId" character varying(10) NOT NULL, CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "province" ("id" character varying(10) NOT NULL, "name" character varying NOT NULL, "description" character varying, "countryId" character varying(10) NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country" ("id" character varying(10) NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" character varying(10) NOT NULL, "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "createAt" TIMESTAMP NOT NULL DEFAULT '2023-03-15T15:58:04.207Z', "updateAt" TIMESTAMP, "refreshTokenHash" character varying, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("accountId" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "PhoneNumber" character varying, "role" character varying NOT NULL, "isSale" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1" PRIMARY KEY ("accountId"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" character varying(10) NOT NULL, "streetAddress" character varying NOT NULL, "countryId" character varying(10), "provinceId" character varying(10), "districtId" character varying(10), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "district" ADD CONSTRAINT "FK_23a21b38208367a242b1dd3a424" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "province" ADD CONSTRAINT "FK_493e19852e51a27ff8e544fd8cc" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d87215343c3a3a67e6a0b7f3ea9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "province" DROP CONSTRAINT "FK_493e19852e51a27ff8e544fd8cc"`);
        await queryRunner.query(`ALTER TABLE "district" DROP CONSTRAINT "FK_23a21b38208367a242b1dd3a424"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP TABLE "province"`);
        await queryRunner.query(`DROP TABLE "district"`);
    }

}
