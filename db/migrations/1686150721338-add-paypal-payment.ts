import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaypalPayment1686150721338 implements MigrationInterface {
    name = 'AddPaypalPayment1686150721338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "paypal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionId" character varying NOT NULL, "paidAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7eb6ea66c59d87647756175458d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "numberOfRooms" integer NOT NULL, "roomId" uuid, "bookingId" uuid, CONSTRAINT "PK_e35dcb428979ee7cc7808440126" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exchange_rate" ("id" SERIAL NOT NULL, "USD" integer NOT NULL DEFAULT '1', "VND" numeric NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c5d27d2b900ef6cdeef0398472" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "freeCancelDueDate"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "isFreeCancel"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "numberOfRooms"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "CustomerName" character varying`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "totalAmount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "isSuccess" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "paypalId" uuid`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "UQ_4057539c990cefa802cf819c5d4" UNIQUE ("paypalId")`);
        await queryRunner.query(`ALTER TABLE "room" ADD "isFreeCancellation" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "room" ADD "freeCancellationPriod" integer`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "cancellationPay" SET DEFAULT '50'`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_4057539c990cefa802cf819c5d4" FOREIGN KEY ("paypalId") REFERENCES "paypal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_room" ADD CONSTRAINT "FK_50557fd862e2f80337e385433d4" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_room" ADD CONSTRAINT "FK_d2c224e81b16a2c06aecfcd5842" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_room" DROP CONSTRAINT "FK_d2c224e81b16a2c06aecfcd5842"`);
        await queryRunner.query(`ALTER TABLE "booking_room" DROP CONSTRAINT "FK_50557fd862e2f80337e385433d4"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_4057539c990cefa802cf819c5d4"`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "cancellationPay" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "freeCancellationPriod"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "isFreeCancellation"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "UQ_4057539c990cefa802cf819c5d4"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "paypalId"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "isSuccess"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "totalAmount"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "CustomerName"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "numberOfRooms" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "isFreeCancel" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "freeCancelDueDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`DROP TABLE "exchange_rate"`);
        await queryRunner.query(`DROP TABLE "booking_room"`);
        await queryRunner.query(`DROP TABLE "paypal"`);
    }

}
