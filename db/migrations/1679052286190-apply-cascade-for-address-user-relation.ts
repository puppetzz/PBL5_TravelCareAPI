import { MigrationInterface, QueryRunner } from "typeorm";

export class applyCascadeForAddressUserRelation1679052286190 implements MigrationInterface {
    name = 'applyCascadeForAddressUserRelation1679052286190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17T11:24:46.755Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17 10:40:14.95'`);
    }

}
