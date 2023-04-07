import { MigrationInterface, QueryRunner } from "typeorm";

export class fixUserMigrate1680859580596 implements MigrationInterface {
    name = 'fixUserMigrate1680859580596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-07T09:26:21.567Z'`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_690a6193eae64156895920ddcd3"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-07T09:26:21.570Z'`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "userAccountId"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "userAccountId" character varying`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "userAccountId"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "userAccountId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "accountId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1" PRIMARY KEY ("accountId")`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_690a6193eae64156895920ddcd3" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_690a6193eae64156895920ddcd3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "accountId" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_68d3c22dbd95449360fdbf7a3f1" PRIMARY KEY ("accountId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "userAccountId"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "userAccountId" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_e69d72a0946ad077bfddfcd2c81" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "userAccountId"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "userAccountId" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-06 04:19:58.064'`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_690a6193eae64156895920ddcd3" FOREIGN KEY ("userAccountId") REFERENCES "user"("accountId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-06 04:19:57.905'`);
    }

}
