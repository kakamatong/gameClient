import { Socket } from './socket/socket';
import { assetManager, BufferAsset, log } from 'cc';
import sproto from './sproto/sproto.js'; // 注意：sproto.js 没有类型声明，ts会提示any类型警告，但不影响功能
import { handleSocketMessage } from './config/config';
import {LogColors} from './framework';
/**
 * SocketManager 
 * 负责Socket的初始化、协议加载、消息处理等功能
 */
export class SocketManager implements handleSocketMessage {
    protected _name: string = 'SocketManager'
    private _socket: Socket | null = null;
    private _request: any;
    private _client: any;
    private _bloaded = false;
    private _isopen = false;
    private _session = 0;
    private _timeid: number = -1;
    private _callBacks: Array<(data: any) => void> = [];
    protected _callBackLink: ((result: boolean) => void) | null = null;
    private _onServerReport: Map<string, (data: any) => void> | null = null;
    
    constructor(){
        this._onServerReport = new Map<string, (data: any) => void>();
    }

    start(url: string, header?: string | string[], callBack?: (result: boolean) => void) {
        if (callBack) {
            this._callBackLink = callBack;
        }
        if (this._socket) {
            this._socket.close();
        }
        this._socket = this.initSocket(url, header);
    }

    initSocket(url: string, header?: string | string[]) {
        this._session = 0;
        this._isopen = false;
        const _socket = new Socket();
        _socket.init(url, header);
        _socket.setHandleMessage(this);
        return _socket;
    }

    loadProtocol(path:string, callBack: () => void) {
        if (this._bloaded) {
            callBack && callBack();
            return
        }
        const bundle = assetManager.loadBundle('protocol', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }
            const protocolPath = path + "/"
            // 必须先读取服务端协议
            bundle.load(protocolPath + 's2c', (err, asset: BufferAsset) => {
                log('loadAsset error', err);

                const buffer = new Uint8Array(asset.buffer());
                const serverSproto = sproto.createNew(buffer);
                this._client = serverSproto?.host('package');

                // 然后读取客户端协议
                bundle.load(protocolPath + 'c2s', (err, asset: BufferAsset) => {
                    log('loadAsset error', err);

                    const buffer = new Uint8Array(asset.buffer());
                    const clientSproto = sproto.createNew(buffer);
                    this._request = this._client.attach(clientSproto);
                    this._bloaded = true;
                    callBack && callBack();
                });
            });
        });
    }

    sendHeartBeat() {
        this.callServer('agent','', 'heartbeat', { timestamp: Date.now() / 1000 }, (data: any) => {
            //log("心跳 ", data.timestamp)
        });
    }

    startHeartBeat() {
        // 每10秒发送一次心跳
        if (this._timeid) {
            clearInterval(this._timeid);
        }
        this._timeid = setInterval(() => {
            this.sendHeartBeat();
        }, 10000);
    }

    callServer(serverName: string, moduleName: string, funcName: string, args:any, callBack?: (data: any) => void){
        const strArgs = JSON.stringify(args)
        const data = {
            serverName: serverName,
            moduleName: moduleName,
            funcName:funcName,
            args: strArgs
        }
        this.sendToServer('call', data, callBack)
    }

    sendToServer(xyname: string, data: any, callBack?: (data: any) => void) {
        this._session++;
        if (callBack) {
            this._callBacks[this._session] = callBack;
        }
        if(data.funcName != 'heartbeat'){
            const logMsg = `[${data.serverName ?? ''}][${data.funcName ?? ''}][${this._session}] `
            log(LogColors.blue(this._name + ' sendToServer '), logMsg, data);
        }
        this._request && this.sendMessage(this._request(xyname, data, this._session));
    }

    sendMessage(message: any) {
        if(this._isopen){
            this._socket && this._socket.sendMessage(message);
        }else{
            log(LogColors.red("_socket 未连接"))
        }
    }

    // type
    // _session
    // result
    dispatchMessage(response: any) {
        if (response.type == "RESPONSE") {
            let result = response.result
            if(result.code){
                result = JSON.parse(response.result.result)
            }
            this._callBacks && this._callBacks[response.session] && this._callBacks[response.session](result);
        } else if (response.type == "REQUEST") {
            if (response.pname == 'svrMsg') {
                // 回调
                this.onReport(response.result.type, JSON.parse(response.result.data));
            }
        }
    }

    onReport(name: string, data: any) {
        if (this._onServerReport) {
            const callBack = this._onServerReport.get(name);
            callBack && callBack(data);
        }
    }

    // 增加服务器广播监听
    addServerReport(name: string, callBack: (data: any) => void) {
        if (!this._onServerReport) {
            this._onServerReport = new Map<string, (data: any) => void>();
        }

        this._onServerReport.set(name, callBack);
    }

    // 移除服务器广播监听
    removeServerReport(name: string) {
        if (this._onServerReport) {
            this._onServerReport.delete(name);
        }
    }

    onOpen(event: any) {
        log(this._name + ' onOpen', event);
        this._isopen = true;
        this._callBackLink &&  this._callBackLink(true)
    }

    onMessage(message: Uint8Array) {
        //log('SocketManager onMessage', message);
        const response = this._client.dispatch(message);
        const type = response.result?.type ?? ""
        const result = response.result.result ?? ""
        if(result.indexOf("heartbeat") == -1){
            const logMsg = `[${response.type}][${type}][${response.session}] `
            log(LogColors.yellow(this._name + ' onMessage '), logMsg, response);
        }
        this.dispatchMessage(response);
    }

    onClose(event: any) {
        log(this._name + ' onClose', event); 
        this._isopen = false;
        this._callBackLink &&  this._callBackLink(false)
    }

    onError(event: any) {

        log(this._name + ' onError', event);
    }
}
