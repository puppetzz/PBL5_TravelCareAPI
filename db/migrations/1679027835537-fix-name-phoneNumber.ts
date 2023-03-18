import { MigrationInterface, QueryRunner } from "typeorm";

export class fixNamePhoneNumber1679027835537 implements MigrationInterface {
    name = 'fixNamePhoneNumber1679027835537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "PhoneNumber" TO "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17T04:37:15.865Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-15 15:58:04.207'`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "phoneNumber" TO "PhoneNumber"`);
    }

}
