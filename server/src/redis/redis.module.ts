import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';


/**
 * 用 @Global() 把它声明为全局模块，这样只需要在 AppModule 里引入
 * 别的模块不用引入也可以注入 RedisService 了
 * */ 
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService:ConfigService) {
        const client = createClient({
            socket: {
                host: configService.get('redis_server_host'),
                port: configService.get('redis_server_port')
            },
            //  查看数据时, 需要注意这个标识
            database: configService.get('redis_server_db')
        });
        try{
          await client.connect();
        }catch(err){
          throw new Error(`redis err ${err}`)
        }
        return client;
      },
      inject:[ConfigService]
    },
  ],
  exports: [RedisService]
})
export class RedisModule {}
