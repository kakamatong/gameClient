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
    SUCCESS: 0,
    ERROR_ACC: 1,
    ERROR_PASS: 2, 
    ERROR_SUBID: 3,
}
