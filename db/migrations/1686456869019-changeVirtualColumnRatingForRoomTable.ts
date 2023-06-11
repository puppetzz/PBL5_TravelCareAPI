import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeVirtualColumnRatingForRoomTable1686456869019 implements MigrationInterface {
    name = 'ChangeVirtualColumnRatingForRoomTable1686456869019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_bed" DROP CONSTRAINT "FK_67147ea15fd6f2c8752c372a0c1"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "room_bed" ADD CONSTRAINT "FK_67147ea15fd6f2c8752c372a0c1" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_bed" DROP CONSTRAINT "FK_67147ea15fd6f2c8752c372a0c1"`);
        await queryRunner.query(`ALTER TABLE "location" ADD "rating" numeric(2,1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "room_bed" ADD CONSTRAINT "FK_67147ea15fd6f2c8752c372a0c1" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
