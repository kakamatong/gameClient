
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

export const SELF_LOCAL = 1;