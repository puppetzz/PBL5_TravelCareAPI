import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnForLocationEntity1680937788347
  implements MigrationInterface
{
  name = 'addColumnForLocationEntity1680937788347';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "About"`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD "about" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD "imageCover" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-08T07:09:49.375Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-08T07:09:49.378Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_f9c9f4fd8190f76a85d23bf1c6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "REL_f9c9f4fd8190f76a85d23bf1c6"`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "addressId"`);
    await queryRunner.query(`ALTER TABLE "location" ADD "addressId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "UQ_f9c9f4fd8190f76a85d23bf1c6b" UNIQUE ("addressId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "addressId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "addressId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271" UNIQUE ("addressId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`,
    );
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "address" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_f9c9f4fd8190f76a85d23bf1c6b" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_f9c9f4fd8190f76a85d23bf1c6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`,
    );
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "address" ADD "id" character varying(10) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "addressId"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "addressId" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271" UNIQUE ("addressId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "UQ_f9c9f4fd8190f76a85d23bf1c6b"`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "addressId"`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD "addressId" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "REL_f9c9f4fd8190f76a85d23bf1c6" UNIQUE ("addressId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_f9c9f4fd8190f76a85d23bf1c6b" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-07 09:26:21.57'`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-07 09:26:21.567'`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "imageCover"`);
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "about"`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD "About" character varying`,
    );
  }
}
