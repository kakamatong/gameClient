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

// Protocol Map 定义
/** 协议映射表，键为协议名，值为包含请求和响应类型的对象 */
export interface ProtocolMap {
    /** svrMsg 协议映射 */
    "svrMsg": {
        request: SvrmsgRequest;
        response: undefined;  // svrMsg 协议没有响应参数
    };
    /** 匹配失败 */
    "matchOnSureFail": {
        request: MatchonsurefailRequest;
        response: undefined;  // matchOnSureFail 协议没有响应参数
    };
    /** 匹配确认 */
    "matchOnSure": {
        request: MatchonsureRequest;
        response: undefined;  // matchOnSure 协议没有响应参数
    };
    /** 游戏房间准备完成 */
    "gameRoomReady": {
        request: GameroomreadyRequest;
        response: undefined;  // gameRoomReady 协议没有响应参数
    };
    /** 更新用户财富 */
    "updateRich": {
        request: UpdaterichRequest;
        response: undefined;  // updateRich 协议没有响应参数
    };
    /** agent准备完成 */
    "agentReady": {
        request: AgentreadyRequest;
        response: undefined;  // agentReady 协议没有响应参数
    };
}
