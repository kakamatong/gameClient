// sproto.d.ts 类型声明

export interface SprotoHost {
    attach(sp: SprotoInstance): (name: string, args: any, session: number) => number[];
    dispatch(buffer: number[]): SprotoDispatchResult;
}

export interface SprotoInstance {
    encode(type: string | number, indata: any): number[] | null;
    decode(type: string | number, inbuf: number[]): any | null;
    pack(inbuf: number[]): number[];
    unpack(inbuf: number[]): number[];
    pencode(type: string | number, indata: any): number[] | null;
    pdecode(type: string | number, inbuf: number[]): any | null;
    host(packagename?: string): SprotoHost;
    queryproto(protocolName: string | number): SprotoProtoInfo | null;
    dump(): void;
    objlen(type: string | number, inbuf: number[]): number;
}

export interface SprotoProtoInfo {
    tag: number;
    name: string;
    request: any;
    response: any;
}

export interface SprotoDispatchResult {
    type: 'REQUEST' | 'RESPONSE';
    pname?: string;
    result?: any;
    responseFunc?: (args: any) => number[];
    session?: number;
}

export interface SprotoStatic {
    createNew(buffer: number[] | Uint8Array): SprotoInstance | null;
    pack(inbuf: number[]): number[];
    unpack(inbuf: number[]): number[];
}

declare const sproto: SprotoStatic;
export default sproto; 