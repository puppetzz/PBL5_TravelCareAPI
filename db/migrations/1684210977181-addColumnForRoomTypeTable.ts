import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnForRoomTypeTable1684210977181
  implements MigrationInterface
{
  name = 'addColumnForRoomTypeTable1684210977181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_type" ADD "numberOfBeds" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_type" ADD "typeOfBeds" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16T04:22:57.684Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-16T04:22:57.761Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16T04:22:57.766Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-16T04:22:57.767Z'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08 17:31:38.076'`,
    );
    await queryRunner.query(
      `ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08 17:31:38.076'`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-08 17:31:38.067'`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-05-08 17:31:37.924'`,
    );
    await queryRunner.query(`ALTER TABLE "room_type" DROP COLUMN "typeOfBeds"`);
    await queryRunner.query(
      `ALTER TABLE "room_type" DROP COLUMN "numberOfBeds"`,
    );
  }
}
