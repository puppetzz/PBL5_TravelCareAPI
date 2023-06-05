import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteLocationForCategory1685973089517 implements MigrationInterface {
    name = 'AddCascadeDeleteLocationForCategory1685973089517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_locations_location" DROP CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9"`);
        await queryRunner.query(`ALTER TABLE "category_locations_location" ADD CONSTRAINT "FK_16c0a15a534e3f86e5dbf1757b9" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

}
