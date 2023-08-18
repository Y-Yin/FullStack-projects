import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

// 把 EmailModule 声明为全局的，并且导出 EmailService
@Global()
@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports:[EmailService]
})
export class EmailModule {}
