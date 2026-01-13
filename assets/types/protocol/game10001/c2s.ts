// Auto-generated from sproto files
// Do not edit manually

/** 调用接口 - 请求参数 */
export interface CallRequest {
    moduleName: string;
    funcName: string;
    args: string;
}

/** 调用接口 - 响应参数 */
export interface CallResponse {
    code: number;
    result: string;
}

/** 调用接口 - 请求参数 */
export interface SendRequest {
    moduleName: string;
    funcName: string;
    args: string;
}

/** 客户端准备 - 请求参数 */
export interface ClientreadyRequest {
    ready: number;
}

/** 游戏协议出手 - 请求参数 */
export interface OuthandRequest {
    flag: number;
}

/** 游戏准备 - 请求参数 */
export interface GamereadyRequest {
    ready: number;
}

/** 游戏准备 - 响应参数 */
export interface GamereadyResponse {
    code: number;
    msg: string;
}

/** 离开房间 - 请求参数 */
export interface LeaveroomRequest {
    flag: number;
}

/** 离开房间 - 响应参数 */
export interface LeaveroomResponse {
    code: number;
    msg: string;
}

/** 解散房间 - 请求参数 */
export interface DisbandroomRequest {
    flag: number;
}

/** 解散房间 - 响应参数 */
export interface DisbandroomResponse {
    code: number;
    msg: string;
}

/** 发起投票解散 - 请求参数 */
export interface VotedisbandroomRequest {
    reason: string;
}

/** 发起投票解散 - 响应参数 */
export interface VotedisbandroomResponse {
    code: number;
    msg: string;
}

/** 投票解散响应 - 请求参数 */
export interface VotedisbandresponseRequest {
    voteId: number;
    agree: number;
}

/** 投票解散响应 - 响应参数 */
export interface VotedisbandresponseResponse {
    code: number;
    msg: string;
}

/** 消息转发协议，服务会下发同名协议 - 请求参数 */
export interface ForwardmessageRequest {
    type: number;
    to: number[];
    msg: string;
}

/** 消息转发协议，服务会下发同名协议 - 响应参数 */
export interface ForwardmessageResponse {
    code: number;
    msg: string;
}

export namespace SprotoCall {
    export const Name = "call";
    export type Request = CallRequest;
    export type Response = CallResponse;
}

export namespace SprotoSend {
    export const Name = "send";
    export type Request = SendRequest;
    export type Response = undefined;  // send 协议没有响应参数
}

export namespace SprotoClientReady {
    export const Name = "clientReady";
    export type Request = ClientreadyRequest;
    export type Response = undefined;  // clientReady 协议没有响应参数
}

export namespace SprotoOutHand {
    export const Name = "outHand";
    export type Request = OuthandRequest;
    export type Response = undefined;  // outHand 协议没有响应参数
}

export namespace SprotoGameReady {
    export const Name = "gameReady";
    export type Request = GamereadyRequest;
    export type Response = GamereadyResponse;
}

export namespace SprotoLeaveRoom {
    export const Name = "leaveRoom";
    export type Request = LeaveroomRequest;
    export type Response = LeaveroomResponse;
}

export namespace SprotoDisbandRoom {
    export const Name = "disbandRoom";
    export type Request = DisbandroomRequest;
    export type Response = DisbandroomResponse;
}

export namespace SprotoVoteDisbandRoom {
    export const Name = "voteDisbandRoom";
    export type Request = VotedisbandroomRequest;
    export type Response = VotedisbandroomResponse;
}

export namespace SprotoVoteDisbandResponse {
    export const Name = "voteDisbandResponse";
    export type Request = VotedisbandresponseRequest;
    export type Response = VotedisbandresponseResponse;
}

export namespace SprotoForwardMessage {
    export const Name = "forwardMessage";
    export type Request = ForwardmessageRequest;
    export type Response = ForwardmessageResponse;
}
