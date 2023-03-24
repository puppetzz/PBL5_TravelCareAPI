import { MigrationInterface, QueryRunner } from "typeorm";

export class addAwsS31679669563450 implements MigrationInterface {
    name = 'addAwsS31679669563450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-24T14:52:44.643Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17 13:09:39.176'`);
    }

}
