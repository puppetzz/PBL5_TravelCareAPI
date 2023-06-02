import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIconRoomHotel1685695668265 implements MigrationInterface {
    name = 'AddIconRoomHotel1685695668265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_amenity" ADD "icon" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_feature" ADD "icon" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_type" ADD "icon" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_type" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "room_feature" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "property_amenity" DROP COLUMN "icon"`);
    }

}
