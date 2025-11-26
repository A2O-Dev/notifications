import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitTables1764165696934 implements MigrationInterface {
  name = 'InitTables1764165696934'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "notifications"."user_notifications_type_enum" AS ENUM('QUOTATION', 'OTHER')`,
    )
    await queryRunner.query(
      `CREATE TABLE "notifications"."user_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "notifications"."user_notifications_type_enum" NOT NULL, "subject" text, "message" text NOT NULL, "is_readed" boolean NOT NULL DEFAULT false, "payload" json, "attachments" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_569622b0fd6e6ab3661de985a2b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "notifications"."message_templates_channel_enum" AS ENUM('EMAIL', 'SYSTEM', 'WHATSAPP')`,
    )
    await queryRunner.query(
      `CREATE TYPE "notifications"."message_templates_type_enum" AS ENUM('QUOTATION', 'OTHER')`,
    )
    await queryRunner.query(
      `CREATE TABLE "notifications"."message_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channel" "notifications"."message_templates_channel_enum" NOT NULL, "type" "notifications"."message_templates_type_enum" NOT NULL, "subject" text, "content" text, CONSTRAINT "PK_9ac2bd9635be662d183f314947d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_010e7da4b013dcbee046d586d3" ON "notifications"."message_templates" ("channel", "type") `,
    )
    await queryRunner.query(
      `CREATE TYPE "notifications"."queue_messages_type_enum" AS ENUM('QUOTATION', 'OTHER')`,
    )
    await queryRunner.query(
      `CREATE TYPE "notifications"."queue_messages_status_enum" AS ENUM('PENDING', 'SUCCESS', 'PROCESSING', 'FAILED')`,
    )
    await queryRunner.query(
      `CREATE TABLE "notifications"."queue_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channel" character varying NOT NULL, "type" "notifications"."queue_messages_type_enum" NOT NULL, "envelope" json NOT NULL, "payload" json, "attachments" jsonb, "status" "notifications"."queue_messages_status_enum" NOT NULL DEFAULT 'PENDING', "retry_count" integer NOT NULL DEFAULT '0', "details" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a03df786f4a362bac2b807f4f95" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"."queue_messages"`)
    await queryRunner.query(
      `DROP TYPE "notifications"."queue_messages_status_enum"`,
    )
    await queryRunner.query(
      `DROP TYPE "notifications"."queue_messages_type_enum"`,
    )
    await queryRunner.query(
      `DROP INDEX "notifications"."IDX_010e7da4b013dcbee046d586d3"`,
    )
    await queryRunner.query(`DROP TABLE "notifications"."message_templates"`)
    await queryRunner.query(
      `DROP TYPE "notifications"."message_templates_type_enum"`,
    )
    await queryRunner.query(
      `DROP TYPE "notifications"."message_templates_channel_enum"`,
    )
    await queryRunner.query(`DROP TABLE "notifications"."user_notifications"`)
    await queryRunner.query(
      `DROP TYPE "notifications"."user_notifications_type_enum"`,
    )
  }
}
