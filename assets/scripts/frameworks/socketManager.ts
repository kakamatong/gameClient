import { Socket } from './socket/socket';
import { assetManager, BufferAsset, log } from 'cc';
import sproto from './sproto/sproto.js'; // 注意：sproto.js 没有类型声明，ts会提示any类型警告，但不影响功能
import { handleSocketMessage, AUTH_TYPE } from './config/config';
import { DataCenter } from '../datacenter/datacenter';
import {LogColors} from './framework';
/**
 * SocketManager 是用于管理Socket连接的单例类
 * 负责Socket的初始化、协议加载、消息处理等功能
 */
export class SocketManager implements handleSocketMessage {
    private socket: Socket | null = null;
    private request: any;
    private client: any;
    private bloaded = false;
    private isopen = false;
    private iscontent = false
    private session = 0;
    private timeid: number = -1;
    private callBacks: Array<(data: any) => void> = [];
    private callBackLink: ((result: boolean) => void) | null = null;
    private onServerReport: Map<string, (data: any) => void> | null = null;
    //单例
    private static _instance: SocketManager;
    public static get instance(): SocketManager {
        if (!this._instance) {
            this._instance = new SocketManager();
        }
        return this._instance;
    }

    initSocket(url: string, header?: string | string[]) {
        this.session = 0;
        this.isopen = false;
        this.iscontent = false
        const socket = new Socket();
        socket.init(url, header);
        socket.setHandleMessage(this);
        return socket;
    }

    start(url: string, header?: string | string[], callBack?: (result: boolean) => void) {
        if (callBack) {
            this.callBackLink = callBack;
        }
        if (this.socket) {
            this.socket.close();
        }
        this.socket = this.initSocket(url, header);
    }

    loadProtocol(callBack: () => void) {
        if (this.bloaded) {
            callBack && callBack();
            return
        }
        const bundle = assetManager.loadBundle('protocol', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }

            // 必须先读取服务端协议
            bundle.load('s2c', (err, asset: BufferAsset) => {
                log('loadAsset error', err);

                const buffer = new Uint8Array(asset.buffer());
                const serverSproto = sproto.createNew(buffer);
                this.client = serverSproto?.host('package');

                // 然后读取客户端协议
                bundle.load('c2s', (err, asset: BufferAsset) => {
                    log('loadAsset error', err);

                    const buffer = new Uint8Array(asset.buffer());
                    const clientSproto = sproto.createNew(buffer);
                    this.request = this.client.attach(clientSproto);
                    this.bloaded = true;
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
        if (this.timeid) {
            clearInterval(this.timeid);
        }
        this.timeid = setInterval(() => {
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
        this.session++;
        if (callBack) {
            this.callBacks[this.session] = callBack;
        }
        log(LogColors.blue('SocketManager sendToServer'), data, this.session);
        this.request && this.sendMessage(this.request(xyname, data, this.session));
    }

    sendMessage(message: any) {
        if(this.iscontent && this.isopen){
            this.socket && this.socket.sendMessage(message);
        }else{
            log(LogColors.red("socket 未连接"))
        }
    }

    // type
    // session
    // result
    dispatchMessage(response: any) {
        if (response.type == "RESPONSE") {
            let result = response.result
            if(result.code){
                result = JSON.parse(response.result.result)
            }
            this.callBacks && this.callBacks[response.session] && this.callBacks[response.session](result);
        } else if (response.type == "REQUEST") {
            if (response.pname == 'svrReady') {
                this.svrReady(response);
                return
            } else if (response.pname == 'svrMsg') {
                // 回调
                this.onReport(response.result.type, JSON.parse(response.result.data));
            }
        }
    }

    svrReady(message: any) {
        if (message.result.code) {
            this.iscontent = true;
            //this.content();
            this.startHeartBeat();
            this.callBackLink &&  this.callBackLink(true)
        } else {
            this.iscontent = false;
            this.callBackLink &&  this.callBackLink(false)
        }
    }

    onReport(name: string, data: any) {
        if (this.onServerReport) {
            const callBack = this.onServerReport.get(name);
            callBack && callBack(data);
        }
    }

    // 增加服务器广播监听
    addServerReport(name: string, callBack: (data: any) => void) {
        if (!this.onServerReport) {
            this.onServerReport = new Map<string, (data: any) => void>();
        }

        this.onServerReport.set(name, callBack);
    }

    // 移除服务器广播监听
    removeServerReport(name: string) {
        if (this.onServerReport) {
            this.onServerReport.delete(name);
        }
    }

    onOpen(event: any) {
        log('SocketManager onOpen', event);
        this.isopen = true;
    }

    onMessage(message: Uint8Array) {
        //log('SocketManager onMessage', message);
        const response = this.client.dispatch(message);
        log(LogColors.yellow('SocketManager onMessage '), response);
        this.dispatchMessage(response);
    }

    onClose(event: any) {
        log('SocketManager onClose', event);
        this.isopen = false;
        this.callBackLink &&  this.callBackLink(false)
    }

    onError(event: any) {
        log('SocketManager onError', event);
    }
}
