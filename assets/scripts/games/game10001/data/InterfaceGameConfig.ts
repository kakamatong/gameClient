
export interface GAME_PLAYER_INFO {
    userid: number;
    nickname?: string;
    headurl?: string;
    sex?: number;
    svrSeat: number;
    status?: number;
    ip?: string;
    province?: string;
    city?: string;
    ext?: string;
}

// 投票解散相关接口定义
export interface VoteInfo {
    userid: number;      // 用户ID
    vote: number;        // 投票状态: 1-同意, 0-拒绝, -1-未投票
}

export interface VoteDisbandStartData {
    voteId: number;         // 投票ID
    initiator: number;      // 发起人 userid
    reason: string;         // 解散原因
    timeLeft: number;       // 剩余时间(秒)
    playerCount: number;    // 房间总人数
    needAgreeCount: number; // 需要同意人数(60%)
}

export interface VoteDisbandUpdateData {
    voteId: number;         // 投票ID
    votes: VoteInfo[];      // 投票状态列表
    agreeCount: number;     // 当前同意人数
    refuseCount: number;    // 当前拒绝人数
    timeLeft: number;       // 剩余时间(秒)
}

export interface VoteDisbandResultData {
    voteId: number;         // 投票ID
    result: number;         // 结果: 1-解散成功, 0-解散失败
    reason: string;         // 结果原因
    agreeCount: number;     // 最终同意人数
    refuseCount: number;    // 最终拒绝人数
    votes: VoteInfo[];      // 最终投票状态
}

// 投票状态枚举
export enum VOTE_STATUS {
    NOT_VOTED = -1,    // 未投票
    REFUSE = 0,        // 拒绝
    AGREE = 1          // 同意
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

export enum ROOM_TYPE {
    MATCH = 0, // 匹配房间
    PRIVATE = 1, // 私人房间
}

export enum HAND_FLAG  {
    ROCK= 0x0001, // 石头
    PAPER= 0x0010, // 布
    SCISSORS= 0x0100, // 剪刀
}

export enum PLAYER_STATUS {
    LOADING = 1,
    OFFLINE = 2,
    ONLINE = 3,
    PLAYING = 4,
    READY = 5

}

export enum ROOM_END_FLAG {
    NONE = 0,
    GAME_END = 1,
    OUT_TIME_WAITING = 2,
    OUT_TIME_PLAYING = 3,
    VOTE_DISBAND = 4,        // 投票解散
    OWNER_DISBAND = 5,        // 房主解散
}

// 游戏区按钮控制器显示
export enum CTRL_BTN_INDEX {
    NONE = 0,           // 不显示按钮
    SURE = 1,           // 确定按钮
    CHANGE = 2,         // 更换按钮
    CONTINUE = 3,       // 继续按钮
    READY = 4,        // 准备按钮

}

export const GAME_MODE_TXT = ['3局2胜','5局3胜','7局4胜','无限对局']

export const SELF_LOCAL = 1;
export const SEAT_1 = 1;
export const SEAT_2 = 2;

export interface GAME_DATA {
    robots?: number[];
    rule?: string;
}

export const HAND_INDEX = [HAND_FLAG.SCISSORS, HAND_FLAG.ROCK, HAND_FLAG.PAPER]