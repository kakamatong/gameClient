
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

export enum ENUM_GAME_STEP {
    NONE = 0,
    START = 1,
    OUT_HAND = 2,
    ROUND_END = 3,
    GAME_END = 4,
}

export enum PLAYER_ATTITUDE {
    THINKING = 0, // 思考
    READY = 1, // 准备
    OUT_HAND = 2, // 出招
}

export const HAND_FLAG = {
    ROCK: 0x0001, // 石头
    PAPER: 0x0010, // 布
    SCISSORS: 0x0100, // 剪刀
}

export const PLAYER_STATUS = {
    LOADING: 1,
    OFFLINE: 2,
    PLAYING: 3,
}

export const SELF_LOCAL = 1;