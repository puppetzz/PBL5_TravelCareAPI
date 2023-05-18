import { MigrationInterface, QueryRunner } from "typeorm";

export class addRoomImageTable1684233264256 implements MigrationInterface {
    name = 'addRoomImageTable1684233264256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageKey" character varying NOT NULL, "imageUrl" character varying NOT NULL, "roomId" uuid NOT NULL, CONSTRAINT "PK_8c32b9db82405a0661e805694fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16T10:34:25.095Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-16T10:34:25.231Z'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16T10:34:25.236Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16T10:34:25.236Z'`);
        await queryRunner.query(`ALTER TABLE "room_image" ADD CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_image" DROP CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16 04:22:57.767'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16 04:22:57.766'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-16 04:22:57.761'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16 04:22:57.684'`);
        await queryRunner.query(`DROP TABLE "room_image"`);
    }

}
