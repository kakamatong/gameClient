export interface LOGIN_INFO {
    username: string;
    userid: number;
    password: string;
    server: string;
    loginType: string;
    token: string;
    subid:number;
}

// nickname 0 : string
// headurl 1 : string
// sex 2 : integer
// province 3 : string
// city 4 : string
// ip 5 : string
// ext 6 : string
export interface USER_DATA {
    userid: number;
    nickname: string;
    headurl: string;
    sex: number;
    province: string;
    city: string;
    ip: string;
    ext: string;
}

// 0 离线
// 1 在线
// 2 匹配中
// 3 准备中
// 4 游戏中
// 5 观战中
// 6 组队中
// 7 断线
export enum ENUM_USER_STATUS {
    OFFLINE = 0, 
    ONLINE = 1,
    MATCHING = 2,
    READY = 3,
    GAMEING = 4,
    WATCH = 5,
    TEAMING = 6,
    DISCONNECT = 7,
}

export interface USER_STATUS {
    roomid?: number;
    gameid?: number;
    status: ENUM_USER_STATUS;
}

export enum LOCAL_KEY {
    LOGIN_INFO = 'loginInfo',
}

// seat 2 : integer
// status 3 : integer #加载中，进入中，准备中，短线中
// userid 4 : integer
// sex 5 : integer
// nickname 6 : string
// headurl 7 : string
// ip 8 : string
// province 9 : string
// city 10 : string
// ext 11 : string
export interface GAME_PLAYER_INFO {
    userid: number;
    nickname: string;
    headurl: string;
    sex: number;
    seat: number;
    status: number;
    ip: string;
    province: string;
    city: string;
    ext: string;

}

