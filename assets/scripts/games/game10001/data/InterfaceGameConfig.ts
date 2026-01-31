/**
 * @file InterfaceGameConfig.ts
 * @description 游戏接口配置：定义游戏 10001 的数据类型和枚举
 * @category 游戏 10001
 */

/**
 * @interface GAME_PLAYER_INFO
 * @description 游戏玩家信息
 */
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
    cp?:number
    win?:number;
    lose?:number;
    draw?:number
}

/**
 * @interface VoteInfo
 * @description 投票信息
 */
// 投票解散相关接口定义
export interface VoteInfo {
    userid: number;      // 用户ID
    vote: number;        // 投票状态: 1-同意, 0-拒绝, -1-未投票
}

/**
 * @interface VoteDisbandStartData
 * @description 投票解散开始数据
 */
export interface VoteDisbandStartData {
    voteId: number;         // 投票ID
    initiator: number;      // 发起人 userid
    reason: string;         // 解散原因
    timeLeft: number;       // 剩余时间(秒)
    playerCount: number;    // 房间总人数
    needAgreeCount: number; // 需要同意人数(60%)
}

/**
 * @interface VoteDisbandUpdateData
 * @description 投票解散更新数据
 */
export interface VoteDisbandUpdateData {
    voteId: number;         // 投票ID
    votes: VoteInfo[];      // 投票状态列表
    agreeCount: number;     // 当前同意人数
    refuseCount: number;    // 当前拒绝人数
    timeLeft: number;       // 剩余时间(秒)
}

/**
 * @interface VoteDisbandResultData
 * @description 投票解散结果数据
 */
export interface VoteDisbandResultData {
    voteId: number;         // 投票ID
    result: number;         // 结果: 1-解散成功, 0-解散失败
    reason: string;         // 结果原因
    agreeCount: number;     // 最终同意人数
    refuseCount: number;    // 最终拒绝人数
    votes: VoteInfo[];      // 最终投票状态
}

/**
 * @enum VOTE_STATUS
 * @description 投票状态枚举
 */
// 投票状态枚举
export enum VOTE_STATUS {
    NOT_VOTED = -1,    // 未投票
    REFUSE = 0,        // 拒绝
    AGREE = 1          // 同意
}

/**
 * @enum ENUM_GAME_STEP
 * @description 游戏步骤枚举
 */
export enum ENUM_GAME_STEP {
    NONE = 0,
    START = 1,
    OUT_HAND = 2,
    ROUND_END = 3,
    GAME_END = 4,
}

/**
 * @enum PLAYER_ATTITUDE
 * @description 玩家状态枚举
 */
export enum PLAYER_ATTITUDE {
    THINKING = 0, // 思考
    READY = 1, // 准备
    OUT_HAND = 2, // 出招
}

/**
 * @enum ROOM_TYPE
 * @description 房间类型枚举
 */
export enum ROOM_TYPE {
    MATCH = 0, // 匹配房间
    PRIVATE = 1, // 私人房间
}

/**
 * @enum HAND_FLAG
 * @description 手势类型枚举（石头剪刀布）
 */
export enum HAND_FLAG  {
    ROCK= 0x0001, // 石头
    PAPER= 0x0010, // 布
    SCISSORS= 0x0100, // 剪刀
}

/**
 * @enum PLAYER_STATUS
 * @description 玩家状态枚举
 */
export enum PLAYER_STATUS {
    LOADING = 1,
    OFFLINE = 2,
    ONLINE = 3,
    PLAYING = 4,
    READY = 5

}

/**
 * @enum ROOM_END_FLAG
 * @description 房间结束标志枚举
 */
export enum ROOM_END_FLAG {
    NONE = 0,
    GAME_END = 1,
    OUT_TIME_WAITING = 2,
    OUT_TIME_PLAYING = 3,
    VOTE_DISBAND = 4,        // 投票解散
    OWNER_DISBAND = 5,        // 房主解散
}

/**
 * @enum CTRL_BTN_INDEX
 * @description 游戏区按钮控制器显示枚举
 */
// 游戏区按钮控制器显示
export enum CTRL_BTN_INDEX {
    NONE = 0,           // 不显示按钮
    SURE = 1,           // 确定按钮
    CHANGE = 2,         // 更换按钮
    CONTINUE = 3,       // 继续按钮
    READY = 4,        // 准备按钮

}

/**
 * @description 游戏模式文本
 */
export const GAME_MODE_TXT = ['3局2胜','5局3胜','7局4胜','无限对局']

/**
 * @description 自身本地位置常量
 */
export const SELF_LOCAL = 1;
/**
 * @description 座位 1
 */
export const SEAT_1 = 1;
/**
 * @description 座位 2
 */
export const SEAT_2 = 2;

/**
 * @interface GAME_DATA
 * @description 游戏数据
 */
export interface GAME_DATA {
    robots?: number[];
    rule?: string;
}

export const ROOM_PLAYER_INDEX: { [key: number]: number } = {
    2:0,
    3:1,
    4:2
}

export const HAND_SOUND_NAME: { [key: number]: string } = {
    [HAND_FLAG.SCISSORS]: "game10001/scissors",
    [HAND_FLAG.ROCK]: "game10001/rock",
    [HAND_FLAG.PAPER]: "game10001/paper"
}

export const HAND_INDEX = [HAND_FLAG.SCISSORS, HAND_FLAG.ROCK, HAND_FLAG.PAPER]

// 消息转发类型
export enum FORWARD_MESSAGE_TYPE {
    //TALK = 1, // 聊天
}