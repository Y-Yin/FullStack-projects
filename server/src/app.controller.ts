import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, UserInfo } from './custom.decorator';
import { userInfo } from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  index() {
    return 'hello world'
  }

  @Get('aaa')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ddd'])
  aaaa() {
    return 'aaa';
  }

  @Get('bbb')
  // 使用自定义权限装饰器， 和 userInfo 参数装饰器
  // 如何拿到userInfo的数据的: 首先得使用了自定义的@RequireLogin() 装饰器
  // 装饰器会将jwt-token 解密出用户信息, 将用户信息放在request中
  @RequireLogin()
  bbb(@UserInfo() userInfo) {
    console.log('userInfo',userInfo)
    return 'bbb';
  }
}
