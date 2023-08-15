import { MigrationInterface, QueryRunner } from 'typeorm';

export class Otp1690960019272 implements MigrationInterface {
  name = 'Otp1690960019272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE otp (
                            id CHAR(36) NOT NULL,
                            userIdentifier VARCHAR(50) NULL,
                            isUsed BOOLEAN NOT NULL DEFAULT FALSE,
                            code VARCHAR(6) NULL,
                            type VARCHAR(50) NULL,
                            expirationDate TIMESTAMP NULL,
                            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            deletedAt TIMESTAMP NULL DEFAULT NULL,
                            PRIMARY KEY (id)
                          )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otp" CASCADE`);
  }
}
