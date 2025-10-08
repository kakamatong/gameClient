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
    MATCH_AUTO_JOIN = 'matchAutoJoin',
    AGREE_PRIVACY = 'agreePrivacy',

    BG_MUSIC_OPEN = 'bgMusicOpen',
}

export enum ENUM_POP_MESSAGE_TYPE {
    NUM2 = 0, // 2个按钮
    NUM1SURE = 1, // 1个按钮 确定
    NUM1CANCEL = 2, // 1个按钮 取消
    NUM0 = 3, // 无按钮
}

export enum ENUM_CHANNEL_ID {
    MINIGAME_WECHAT = 'wechatMiniGame',
    ACCOUNT = 'account',
}

export const LOGIN_TYPE = {
    [ENUM_CHANNEL_ID.MINIGAME_WECHAT] : 'wechatMiniGame',
    [ENUM_CHANNEL_ID.ACCOUNT] : 'account',
}

export interface GAME_RECORD {
    gameid: number;
    win: number;
    lose:number;
    draw?: number;
}

export const DEFAULT_HEADURL = 'https://qiudaoyu-miniapp.oss-cn-hangzhou.aliyuncs.com/head/ji.png'
export const MAIN_GAME_ID = 10001