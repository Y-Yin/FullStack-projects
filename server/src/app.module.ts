import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guard/login.guard';
import { PermissionGuard } from './guard/permission.guard';

@Module({
  imports: [
    // 全局启用config模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/.env.${process.env.NODE_ENV}`
    }),
    // CREATE DATABASE meeting_room_booking_system DEFAULT CHARACTER SET utf8mb4;
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: "mysql",
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [
            User, Role, Permission
          ],
          poolSize: 10,
          connectorPackage: 'mysql2',
        }
      },
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      global:true,
      useFactory(configService:ConfigService){
        return {
          secret:configService.get('jwt_secret'),
          signOptions:{
            expiresIn:'30m' // 默认30分钟
          }
        }
      },
      inject:[ConfigService]
    }),
    UserModule,
    RedisModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局启用 guard
    {
      provide:APP_GUARD,
      useClass:LoginGuard
    },
    {
      provide:APP_GUARD,
      useClass:PermissionGuard
    }
  ],
})
export class AppModule {}
