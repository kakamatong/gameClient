// Auto-generated from sproto files
// Do not edit manually

/** svrMsg 协议请求参数 - 请求参数 */
export interface SvrmsgRequest {
    type: string;
    data: string;
}

/** 匹配失败 - 请求参数 */
export interface MatchonsurefailRequest {
    code: number;
    msg: string;
}

/** 匹配确认 - 请求参数 */
export interface MatchonsureRequest {
    gameid: number;
    queueid: number;
    playerids: number[];
    readys: number[];
    cancels: number[];
    createTime: number;
    endTime: number;
    id: number;
}

/** 游戏房间准备完成 - 请求参数 */
export interface GameroomreadyRequest {
    gameid: number;
    roomid: string;
    addr: string;
}

/** 更新用户财富 - 请求参数 */
export interface UpdaterichRequest {
    richTypes: number[];
    richNums: number[];
    allRichNums: number[];
}

/** agent准备完成 - 请求参数 */
export interface AgentreadyRequest {
    time: number;
}

export namespace SvrMsg {
    export const Name = "svrMsg";
    export type Request = SvrmsgRequest;
    export type Response = undefined;  // svrMsg 协议没有响应参数
}

export namespace MatchOnSureFail {
    export const Name = "matchOnSureFail";
    export type Request = MatchonsurefailRequest;
    export type Response = undefined;  // matchOnSureFail 协议没有响应参数
}

export namespace MatchOnSure {
    export const Name = "matchOnSure";
    export type Request = MatchonsureRequest;
    export type Response = undefined;  // matchOnSure 协议没有响应参数
}

export namespace GameRoomReady {
    export const Name = "gameRoomReady";
    export type Request = GameroomreadyRequest;
    export type Response = undefined;  // gameRoomReady 协议没有响应参数
}

export namespace UpdateRich {
    export const Name = "updateRich";
    export type Request = UpdaterichRequest;
    export type Response = undefined;  // updateRich 协议没有响应参数
}

export namespace AgentReady {
    export const Name = "agentReady";
    export type Request = AgentreadyRequest;
    export type Response = undefined;  // agentReady 协议没有响应参数
}
