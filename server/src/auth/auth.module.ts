import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Global()
@Module({
  providers: [AuthService],
  // 设置为全局模块以后， 然后需要导出，别的模块才能直接使用
  exports:[AuthService]
})
export class AuthModule {}
