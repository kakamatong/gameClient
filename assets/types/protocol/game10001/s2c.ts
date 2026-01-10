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

// Protocol Map 定义
/** 协议映射表，键为协议名，值为包含请求和响应类型的对象 */
export interface ProtocolMap {
    /** svrMsg 协议映射 */
    "svrMsg": {
        request: SvrmsgRequest;
        response: undefined;  // svrMsg 协议没有响应参数
    };
    /** 房间信息 */
    "roomInfo": {
        request: RoominfoRequest;
        response: undefined;  // roomInfo 协议没有响应参数
    };
    /** 步骤id */
    "stepId": {
        request: StepidRequest;
        response: undefined;  // stepId 协议没有响应参数
    };
    /** 玩家姿态 */
    "playerAtt": {
        request: PlayerattRequest;
        response: undefined;  // playerAtt 协议没有响应参数
    };
    /** 玩家出招信息 */
    "outHandInfo": {
        request: OuthandinfoRequest;
        response: undefined;  // outHandInfo 协议没有响应参数
    };
    /** 一轮游戏结果 */
    "roundResult": {
        request: RoundresultRequest;
        response: undefined;  // roundResult 协议没有响应参数
    };
    /** 房间结束 */
    "roomEnd": {
        request: RoomendRequest;
        response: undefined;  // roomEnd 协议没有响应参数
    };
    /** 玩家信息 */
    "playerInfos": {
        request: PlayerinfosRequest;
        response: undefined;  // playerInfos 协议没有响应参数
    };
    /** 游戏开始 */
    "gameStart": {
        request: GamestartRequest;
        response: undefined;  // gameStart 协议没有响应参数
    };
    /** 游戏结束 */
    "gameEnd": {
        request: GameendRequest;
        response: undefined;  // gameEnd 协议没有响应参数
    };
    /** 玩家加入 */
    "playerEnter": {
        request: PlayerenterRequest;
        response: undefined;  // playerEnter 协议没有响应参数
    };
    /** 更新玩家状态 */
    "playerStatusUpdate": {
        request: PlayerstatusupdateRequest;
        response: undefined;  // playerStatusUpdate 协议没有响应参数
    };
    /** 玩家离开 */
    "playerLeave": {
        request: PlayerleaveRequest;
        response: undefined;  // playerLeave 协议没有响应参数
    };
    /** 投票解散开始通知 */
    "voteDisbandStart": {
        request: VotedisbandstartRequest;
        response: undefined;  // voteDisbandStart 协议没有响应参数
    };
    /** 投票状态更新 */
    "voteDisbandUpdate": {
        request: VotedisbandupdateRequest;
        response: undefined;  // voteDisbandUpdate 协议没有响应参数
    };
    /** 投票解散结果 */
    "voteDisbandResult": {
        request: VotedisbandresultRequest;
        response: undefined;  // voteDisbandResult 协议没有响应参数
    };
    /** 游戏时钟 */
    "gameClock": {
        request: GameclockRequest;
        response: undefined;  // gameClock 协议没有响应参数
    };
    /** 私人房信息 */
    "privateInfo": {
        request: PrivateinfoRequest;
        response: undefined;  // privateInfo 协议没有响应参数
    };
    /** 私人房总结算 */
    "totalResult": {
        request: TotalresultRequest;
        response: undefined;  // totalResult 协议没有响应参数
    };
    /** 私人房对战记录 */
    "gameRecord": {
        request: GamerecordRequest;
        response: undefined;  // gameRecord 协议没有响应参数
    };
}
