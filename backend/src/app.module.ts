import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/scitech'),
    AuthModule,
    MachinesModule,
  ],
})
export class AppModule { }
