// Auto-generated from sproto files
// Do not edit manually

/** 登录服务协议(0-9999) */
export interface package {
    type: number;
    session: number;
}

/** 奖励通知 */
export interface AwardNotice {
    id: number;
    userid: number;
    status: number;
    awardMessage: string;
    create_at: string;
}

/** 调用接口 - 请求参数 */
export interface CallRequest {
    serverName: string;
    moduleName: string;
    funcName: string;
    args: string;
}

/** 调用接口 - 响应参数 */
export interface CallResponse {
    code: number;
    result: string;
}

/** 用户数据 - 请求参数 */
export interface UserdataRequest {
    userid: number;
}

/** 用户数据 - 响应参数 */
export interface UserdataResponse {
    nickname: string;
    headurl: string;
    sex: number;
    province: string;
    city: string;
    ip: string;
    ext: string;
}

/** 用户财富 - 响应参数 */
export interface UserrichesResponse {
    richType: number[];
    richNums: number[];
}

/** 用户状态 - 请求参数 */
export interface UserstatusRequest {
    userid: number;
}

/** 用户状态 - 响应参数 */
export interface UserstatusResponse {
    status: number;
    gameid: number;
    shortRoomid: number;
    roomid: string;
    addr: string;
}

/** 加入匹配 - 请求参数 */
export interface MatchjoinRequest {
    gameid: number;
    queueid: number;
}

/** 加入匹配 - 响应参数 */
export interface MatchjoinResponse {
    code: number;
    msg: string;
    gameid: number;
    shortRoomid: number;
    roomid: string;
    addr: string;
}

/** 退出匹配 - 请求参数 */
export interface MatchleaveRequest {
    gameid: number;
    queueid: number;
}

/** 退出匹配 - 响应参数 */
export interface MatchleaveResponse {
    code: number;
    msg: string;
}

/** 匹配确认 - 请求参数 */
export interface MatchonsureRequest {
    id: number;
    sure: boolean;
}

/** 匹配确认 - 响应参数 */
export interface MatchonsureResponse {
    code: number;
    msg: string;
}

/** 调用活动接口 - 请求参数 */
export interface CallactivityfuncRequest {
    moduleName: string;
    funcName: string;
    args: string;
}

/** 调用活动接口 - 响应参数 */
export interface CallactivityfuncResponse {
    code: number;
    result: string;
}

/** 开启测试模式 - 请求参数 */
export interface MatchteststartRequest {
    code: number;
}

/** 开启测试模式 - 响应参数 */
export interface MatchteststartResponse {
    code: number;
    msg: string;
}

/** 关闭测试模式 - 请求参数 */
export interface MatchteststopRequest {
    code: number;
}

/** 关闭测试模式 - 响应参数 */
export interface MatchteststopResponse {
    code: number;
    msg: string;
}

/** 获取奖励通知 - 请求参数 */
export interface GetawardnoticeRequest {
    userid: number;
}

/** 获取奖励通知 - 响应参数 */
export interface GetawardnoticeResponse {
    list: AwardNotice[];
}

/** 设置奖励通知已读 - 请求参数 */
export interface SetawardnoticereadRequest {
    id: number;
}

/** 加入私有房间 - 请求参数 */
export interface JoinprivateroomRequest {
    shortRoomid: number;
}

/** 加入私有房间 - 响应参数 */
export interface JoinprivateroomResponse {
    code: number;
    msg: string;
    gameid: number;
    roomid: string;
    addr: string;
    rule: string;
}

/** 创建私有房间 - 请求参数 */
export interface CreateprivateroomRequest {
    gameid: number;
    rule: string;
}

/** 创建私有房间 - 响应参数 */
export interface CreateprivateroomResponse {
    code: number;
    msg: string;
    gameid: number;
    shortRoomid: number;
    roomid: string;
    addr: string;
    rule: string;
}

/** 获取用户游戏记录 - 请求参数 */
export interface UsergamerecordRequest {
    userid: number;
    gameid: number;
}

/** 获取用户游戏记录 - 响应参数 */
export interface UsergamerecordResponse {
    gameid: number;
    win: number;
    lose: number;
    draw: number;
}

/** 更新昵称和头像 - 请求参数 */
export interface UpdateusernameandheadurlRequest {
    nickname: string;
    headurl: string;
}

/** 更新昵称和头像 - 响应参数 */
export interface UpdateusernameandheadurlResponse {
    code: number;
}

/** 注销 - 请求参数 */
export interface RevokeaccRequest {
    loginType: string;
}

/** 注销 - 响应参数 */
export interface RevokeaccResponse {
    code: number;
    msg: string;
}

/** 取消注销 - 请求参数 */
export interface CancelrevokeaccRequest {
    loginType: string;
}

/** 取消注销 - 响应参数 */
export interface CancelrevokeaccResponse {
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
    /** 用户数据 */
    "userData": {
        request: UserdataRequest;
        response: UserdataResponse;
    };
    /** 用户财富 */
    "userRiches": {
        request: undefined;  // userRiches 协议没有请求参数
        response: UserrichesResponse;
    };
    /** 用户状态 */
    "userStatus": {
        request: UserstatusRequest;
        response: UserstatusResponse;
    };
    /** 加入匹配 */
    "matchJoin": {
        request: MatchjoinRequest;
        response: MatchjoinResponse;
    };
    /** 退出匹配 */
    "matchLeave": {
        request: MatchleaveRequest;
        response: MatchleaveResponse;
    };
    /** 匹配确认 */
    "matchOnSure": {
        request: MatchonsureRequest;
        response: MatchonsureResponse;
    };
    /** 调用活动接口 */
    "callActivityFunc": {
        request: CallactivityfuncRequest;
        response: CallactivityfuncResponse;
    };
    /** 开启测试模式 */
    "matchTestStart": {
        request: MatchteststartRequest;
        response: MatchteststartResponse;
    };
    /** 关闭测试模式 */
    "matchTestStop": {
        request: MatchteststopRequest;
        response: MatchteststopResponse;
    };
    /** 获取奖励通知 */
    "getAwardNotice": {
        request: GetawardnoticeRequest;
        response: GetawardnoticeResponse;
    };
    /** 设置奖励通知已读 */
    "setAwardNoticeRead": {
        request: SetawardnoticereadRequest;
        response: undefined;  // setAwardNoticeRead 协议没有响应参数
    };
    /** 加入私有房间 */
    "joinPrivateRoom": {
        request: JoinprivateroomRequest;
        response: JoinprivateroomResponse;
    };
    /** 创建私有房间 */
    "createPrivateRoom": {
        request: CreateprivateroomRequest;
        response: CreateprivateroomResponse;
    };
    /** 获取用户游戏记录 */
    "userGameRecord": {
        request: UsergamerecordRequest;
        response: UsergamerecordResponse;
    };
    /** 更新昵称和头像 */
    "updateUserNameAndHeadurl": {
        request: UpdateusernameandheadurlRequest;
        response: UpdateusernameandheadurlResponse;
    };
    /** 注销 */
    "revokeAcc": {
        request: RevokeaccRequest;
        response: RevokeaccResponse;
    };
    /** 取消注销 */
    "cancelRevokeAcc": {
        request: CancelrevokeaccRequest;
        response: CancelrevokeaccResponse;
    };
}
