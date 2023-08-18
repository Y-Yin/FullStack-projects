// dto 是接收参数的， vo是封装返回的数据的，entity 是和数据库表对应的

interface UserInfo {
    id: number;

    username: string;

    nickName: string;

    email: string;

    headPic: string;

    phoneNumber: string;

    isFrozen: boolean;

    isAdmin: boolean;

    createTime: Date;

    roles: string[];

    permissions: string[]
}


export class LoginUserVo {

    userInfo: UserInfo;

    accessToken: string;

    refreshToken: string;
}

