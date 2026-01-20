export interface handleSocketMessage {
    onOpen(event: any): void;
    onMessage(message: Uint8Array): void;
    onClose(event: any): void;
    onError(error: any): void;
}

export interface RESPONSE {
    type:string;
    session:number;
    result:any;
}

export const AUTH_TYPE = {
    SUCCESS: 1,
    ERROR: 0,
}

// 视频广告码
export enum REWORD_VIDEOAD_CODE {
    FAIL = 0, // 失败
    SUCCESS = 1, // 成功
    NOT_OVER = 2, // 没看完
    NOT_KEY = 3 // 这个key
}
