import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Inject(AuthService)
  authService:AuthService;

  @Inject(ConfigService)
  configService:ConfigService;

  @Inject(RedisService)
  redisService: RedisService;

  @Inject(EmailService)
  emailService: EmailService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {

    // 生成验证码
    const code = Math.random().toString().slice(2, 8);

    // 将验证码存储到redis中，并且设置过期时间
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    // 调用邮箱服务，发送验证码
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`
    });
    return '发送成功';
  }


  @Get("init-data") 
  async initData() {
      await this.userService.initData();
      return '初始化数据成功';
  }


  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);

    // 登录认证通过之后返回 access_token 和 refresh_token：
    vo.accessToken = this.authService.createToken(vo.userInfo);
    vo.refreshToken = this.authService.createRefreshToken(vo.userInfo);


    return vo;
  }
  
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);

    // 登录认证通过之后返回 access_token 和 refresh_token：
    vo.accessToken = this.authService.createToken(vo.userInfo);
    vo.refreshToken = this.authService.createRefreshToken(vo.userInfo);

    return vo;
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
      try {
        const data = this.jwtService.verify(refreshToken);
  
        const user = await this.userService.findUserById(data.userId, false);
  
        const access_token = this.authService.createToken(user);
  
        const refresh_token = this.authService.createRefreshToken(user);
  
        return {
          access_token,
          refresh_token
        }
      } catch(e) {
        throw new UnauthorizedException('token 已失效，请重新登录');
      }
  }
  



}
