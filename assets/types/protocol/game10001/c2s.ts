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

// Protocol Map 定义
/** 协议映射表，键为协议名，值为包含请求和响应类型的对象 */
export interface ProtocolMap {
    /** 调用接口 */
    "call": {
        request: CallRequest;
        response: CallResponse;
    };
    /** 调用接口 */
    "send": {
        request: SendRequest;
        response: undefined;  // send 协议没有响应参数
    };
    /** 客户端准备 */
    "clientReady": {
        request: ClientreadyRequest;
        response: undefined;  // clientReady 协议没有响应参数
    };
    /** 游戏协议出手 */
    "outHand": {
        request: OuthandRequest;
        response: undefined;  // outHand 协议没有响应参数
    };
    /** 游戏准备 */
    "gameReady": {
        request: GamereadyRequest;
        response: GamereadyResponse;
    };
    /** 离开房间 */
    "leaveRoom": {
        request: LeaveroomRequest;
        response: LeaveroomResponse;
    };
    /** 解散房间 */
    "disbandRoom": {
        request: DisbandroomRequest;
        response: DisbandroomResponse;
    };
    /** 发起投票解散 */
    "voteDisbandRoom": {
        request: VotedisbandroomRequest;
        response: VotedisbandroomResponse;
    };
    /** 投票解散响应 */
    "voteDisbandResponse": {
        request: VotedisbandresponseRequest;
        response: VotedisbandresponseResponse;
    };
}
