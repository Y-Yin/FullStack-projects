import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    @Inject(JwtService)
    jwtService: JwtService

    @Inject(ConfigService)
    configService: ConfigService;


    // 根据用户信息创建 access_token
    createToken(userInfo) {
        return this.jwtService.sign({
            userId: userInfo.id,
            username: userInfo.username,
            roles: userInfo.roles,
            permissions: userInfo.permissions
        }, {
            expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
        })
    }

    // 根据userId创建refresh_token
    createRefreshToken(userInfo) {
        return this.jwtService.sign({
            userId: userInfo.id
        }, {
            expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
        });
    }
}
