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
