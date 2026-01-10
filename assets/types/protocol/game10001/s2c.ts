// Auto-generated from sproto files
// Do not edit manually

/** ResultInfo 结构体定义 */
export interface ResultInfo {
    seat: number;
    outHand: number;
    endResult: number;
}

/** PlayerInfo 结构体定义 */
export interface PlayerInfo {
    userid: number;
    nickname: string;
    headurl: string;
    sex: number;
    province: string;
    city: string;
    ip: string;
    status: number;
    cp: number;
    ext: string;
}

/** VoteInfo 结构体定义 */
export interface VoteInfo {
    userid: number;
    vote: number;
}

/** TotalResultInfo 结构体定义 */
export interface TotalResultInfo {
    seat: number;
    userid: number;
    score: number;
    win: number;
    lose: number;
    draw: number;
    ext: string;
}

/** Record 结构体定义 */
export interface Record {
    index: number;
    outhand: number[];
    win: number;
    startTime: number;
    endTime: number;
    round: number;
}

/** svrMsg 协议请求参数 - 请求参数 */
export interface SvrmsgRequest {
    type: string;
    data: string;
}

/** 房间信息 - 请求参数 */
export interface RoominfoRequest {
    gameid: number;
    roomid: number;
    playerids: number[];
    gameData: string;
    shortRoomid: number;
    owner: number;
}

/** 步骤id - 请求参数 */
export interface StepidRequest {
    step: number;
}

/** 玩家姿态 - 请求参数 */
export interface PlayerattRequest {
    seat: number;
    att: number;
}

/** 玩家出招信息 - 请求参数 */
export interface OuthandinfoRequest {
    seat: number;
    flag: number;
}

/** 一轮游戏结果 - 请求参数 */
export interface RoundresultRequest {
    roundNum: number;
    outHandNum: number;
    continue: number;
    info: ResultInfo[];
    score: string;
}

/** 房间结束 - 请求参数 */
export interface RoomendRequest {
    code: number;
}

/** 玩家信息 - 请求参数 */
export interface PlayerinfosRequest {
    infos: PlayerInfo[];
}

/** 游戏开始 - 请求参数 */
export interface GamestartRequest {
    roundNum: number;
    startTime: number;
    brelink: number;
    roundData: string;
}

/** 游戏结束 - 请求参数 */
export interface GameendRequest {
    roundNum: number;
    endTime: number;
    roundData: string;
}

/** 玩家加入 - 请求参数 */
export interface PlayerenterRequest {
    userid: number;
    seat: number;
}

/** 更新玩家状态 - 请求参数 */
export interface PlayerstatusupdateRequest {
    userid: number;
    status: number;
}

/** 玩家离开 - 请求参数 */
export interface PlayerleaveRequest {
    userid: number;
    seat: number;
}

/** 投票解散开始通知 - 请求参数 */
export interface VotedisbandstartRequest {
    voteId: number;
    initiator: number;
    reason: string;
    timeLeft: number;
    playerCount: number;
    needAgreeCount: number;
}

/** 投票状态更新 - 请求参数 */
export interface VotedisbandupdateRequest {
    voteId: number;
    votes: VoteInfo[];
    agreeCount: number;
    refuseCount: number;
    timeLeft: number;
}

/** 投票解散结果 - 请求参数 */
export interface VotedisbandresultRequest {
    voteId: number;
    result: number;
    reason: string;
    agreeCount: number;
    refuseCount: number;
    votes: VoteInfo[];
}

/** 游戏时钟 - 请求参数 */
export interface GameclockRequest {
    time: number;
    seat: number;
}

/** 私人房信息 - 请求参数 */
export interface PrivateinfoRequest {
    nowCnt: number;
    maxCnt: number;
    ext: string;
}

/** 私人房总结算 - 请求参数 */
export interface TotalresultRequest {
    startTime: number;
    endTime: number;
    shortRoomid: number;
    roomid: number;
    owner: number;
    rule: string;
    playCnt: number;
    maxCnt: number;
    totalResultInfo: TotalResultInfo[];
}

/** 私人房对战记录 - 请求参数 */
export interface GamerecordRequest {
    record: Record[];
}

export namespace SvrMsg {
    export const Name = "svrMsg";
    export type Request = SvrmsgRequest;
    export type Response = undefined;  // svrMsg 协议没有响应参数
}

export namespace RoomInfo {
    export const Name = "roomInfo";
    export type Request = RoominfoRequest;
    export type Response = undefined;  // roomInfo 协议没有响应参数
}

export namespace StepId {
    export const Name = "stepId";
    export type Request = StepidRequest;
    export type Response = undefined;  // stepId 协议没有响应参数
}

export namespace PlayerAtt {
    export const Name = "playerAtt";
    export type Request = PlayerattRequest;
    export type Response = undefined;  // playerAtt 协议没有响应参数
}

export namespace OutHandInfo {
    export const Name = "outHandInfo";
    export type Request = OuthandinfoRequest;
    export type Response = undefined;  // outHandInfo 协议没有响应参数
}

export namespace RoundResult {
    export const Name = "roundResult";
    export type Request = RoundresultRequest;
    export type Response = undefined;  // roundResult 协议没有响应参数
}

export namespace RoomEnd {
    export const Name = "roomEnd";
    export type Request = RoomendRequest;
    export type Response = undefined;  // roomEnd 协议没有响应参数
}

export namespace PlayerInfos {
    export const Name = "playerInfos";
    export type Request = PlayerinfosRequest;
    export type Response = undefined;  // playerInfos 协议没有响应参数
}

export namespace GameStart {
    export const Name = "gameStart";
    export type Request = GamestartRequest;
    export type Response = undefined;  // gameStart 协议没有响应参数
}

export namespace GameEnd {
    export const Name = "gameEnd";
    export type Request = GameendRequest;
    export type Response = undefined;  // gameEnd 协议没有响应参数
}

export namespace PlayerEnter {
    export const Name = "playerEnter";
    export type Request = PlayerenterRequest;
    export type Response = undefined;  // playerEnter 协议没有响应参数
}

export namespace PlayerStatusUpdate {
    export const Name = "playerStatusUpdate";
    export type Request = PlayerstatusupdateRequest;
    export type Response = undefined;  // playerStatusUpdate 协议没有响应参数
}

export namespace PlayerLeave {
    export const Name = "playerLeave";
    export type Request = PlayerleaveRequest;
    export type Response = undefined;  // playerLeave 协议没有响应参数
}

export namespace VoteDisbandStart {
    export const Name = "voteDisbandStart";
    export type Request = VotedisbandstartRequest;
    export type Response = undefined;  // voteDisbandStart 协议没有响应参数
}

export namespace VoteDisbandUpdate {
    export const Name = "voteDisbandUpdate";
    export type Request = VotedisbandupdateRequest;
    export type Response = undefined;  // voteDisbandUpdate 协议没有响应参数
}

export namespace VoteDisbandResult {
    export const Name = "voteDisbandResult";
    export type Request = VotedisbandresultRequest;
    export type Response = undefined;  // voteDisbandResult 协议没有响应参数
}

export namespace GameClock {
    export const Name = "gameClock";
    export type Request = GameclockRequest;
    export type Response = undefined;  // gameClock 协议没有响应参数
}

export namespace PrivateInfo {
    export const Name = "privateInfo";
    export type Request = PrivateinfoRequest;
    export type Response = undefined;  // privateInfo 协议没有响应参数
}

export namespace TotalResult {
    export const Name = "totalResult";
    export type Request = TotalresultRequest;
    export type Response = undefined;  // totalResult 协议没有响应参数
}

export namespace GameRecord {
    export const Name = "gameRecord";
    export type Request = GamerecordRequest;
    export type Response = undefined;  // gameRecord 协议没有响应参数
}
