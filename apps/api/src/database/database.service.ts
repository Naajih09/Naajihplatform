import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    const db = await this.$queryRawUnsafe(
      `SELECT current_database() as db, current_schema() as schema;`,
    );
    console.log('Connected to database:', db);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
