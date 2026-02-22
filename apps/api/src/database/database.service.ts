import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log(' Connected to DB:', process.env.DATABASE_URL);
    await this.$connect();
    const db = await this.$queryRawUnsafe(
      `SELECT current_database() as db, current_schema() as schema;`,
    );
    console.log(' Connected to:', db);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
