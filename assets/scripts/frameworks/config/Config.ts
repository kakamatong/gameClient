/**
 * @file Config.ts
 * @description 框架配置：定义接口、常量和事件名称
 * @category 核心框架
 */

/**
 * @interface handleSocketMessage
 * @description Socket 消息处理接口
 */
export interface handleSocketMessage {
    onOpen(event: any): void;
    onMessage(message: Uint8Array): void;
    onClose(event: any): void;
    onError(error: any): void;
}

/**
 * @interface RESPONSE
 * @description 服务器响应数据结构
 */
export interface RESPONSE {
    type:string;
    session:number;
    result:any;
}

/**
 * @description 认证类型常量
 */
export const AUTH_TYPE = {
    SUCCESS: 1,
    ERROR: 0,
}

/**
 * @enum REWORD_VIDEOAD_CODE
 * @description 视频广告返回码枚举
 */
export enum REWORD_VIDEOAD_CODE {
    FAIL = 0, // 失败
    SUCCESS = 1, // 成功
    NOT_OVER = 2, // 没看完
    NOT_KEY = 3 // 这个key
}

export const SAFE_AREA_TOP = 44 // 默认值，实际使用时从 MiniGameUtils 获取

// 框架事件名称常量
export const FW_EVENT_NAMES = {
    // Socket连接事件
    SOCKET_DISCONNECT: 'socketDisconnect',
    GAME_SOCKET_DISCONNECT: 'gameSocketDisconnect',
    
    // 应用生命周期事件
    ON_SHOW: 'onShow',
} as const;
