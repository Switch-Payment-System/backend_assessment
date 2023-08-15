import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1689563449892 implements MigrationInterface {
  name = 'Users1689563449892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
                        id CHAR(36) NOT NULL,
                        firstName VARCHAR(100) NULL,
                        lastName VARCHAR(100) NULL,
                        fullName VARCHAR(100) NULL,
                        businessName VARCHAR(100) NULL,
                        email VARCHAR(100) NOT NULL UNIQUE,
                        userType VARCHAR(50) NOT NULL,
                        password TEXT NULL,
                        gender VARCHAR(50) NULL,
                        dob VARCHAR(50) NULL,
                        bvn VARCHAR(50) NULL,
                        avatar VARCHAR(100) NULL,
                        phoneNumber VARCHAR(50) NULL UNIQUE,
                        maritalStatus VARCHAR(50) NULL,
                        address TEXT NULL,
                        isWaitlistUser BOOLEAN NOT NULL DEFAULT FALSE,
                        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        deletedAt TIMESTAMP NULL DEFAULT NULL,
                        PRIMARY KEY (id)
                      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users" CASCADE`);
  }
}
