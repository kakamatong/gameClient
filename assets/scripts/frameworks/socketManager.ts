import { Socket } from '../frameworks/socket/socket';
import { assetManager, BufferAsset, log } from 'cc';
import sproto from './sproto/sproto.js'; // 注意：sproto.js 没有类型声明，ts会提示any类型警告，但不影响功能
import { handleSocketMessage, AUTH_TYPE } from './config/config';
import { DataCenter } from '../datacenter/datacenter';

/**
 * SocketManager 是用于管理Socket连接的单例类
 * 负责Socket的初始化、协议加载、消息处理等功能
 */
export class SocketManager implements handleSocketMessage {
    private socket: Socket | null = null;
    private request: any;
    private client: any;
    private bloaded = false;
    private iscontent = false;
    private isopen = false;
    private session = 0;
    private timeid: number = -1;
    private callBacks: Array<(data: any) => void> = [];
    private callBackContent: ((result: boolean) => void) | null = null;
    private callBackAuth: ((result: boolean) => void) | null = null;
    private onServerReport: Map<string, (data: any) => void> | null = null;
    //单例
    private static _instance: SocketManager;
    public static get instance(): SocketManager {
        if (!this._instance) {
            this._instance = new SocketManager();
        }
        return this._instance;
    }

    initSocket(url: string) {
        this.session = 0;
        this.iscontent = false;
        this.isopen = false;
        const socket = new Socket();
        socket.init(url);
        socket.setHandleMessage(this);
        return socket;
    }

    start(url: string, callBack?: (result: boolean) => void) {
        if (callBack) {
            this.callBackContent = callBack;
        }

        this.socket = this.initSocket(url);
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

    content(callBack?: (result: boolean) => void) {
        if (callBack) {
            this.callBackAuth = callBack;
        }
        const loginInfo = DataCenter.instance.getLoginInfo();
        log('SocketManager loginInfo', loginInfo);
        const contentInfo = {
            username: loginInfo?.username,
            userid: loginInfo?.userid,
            password: loginInfo?.token,
            device: 'pc',
            version: '0.0.1',
            subid: loginInfo?.subid,
        }
        this.sendToServer('auth', contentInfo, (data: any) => {
            if (data.code == AUTH_TYPE.SUCCESS) {
                this.iscontent = true;
                log('认证成功');
                DataCenter.instance.addSubid(loginInfo?.subid ?? 0 + 1);
                this.startHeartBeat();
                this.callBackAuth && this.callBackAuth(true);
            } else {
                log('认证失败 ', data.msg);
                this.callBackAuth && this.callBackAuth(false);
            }
        })
    }

    sendHeartBeat() {
        this.sendToServer('heartbeat', { timestamp: Date.now() / 1000 }, (data: any) => {
            log("心跳 ", data.timestamp)
        });
    }

    startHeartBeat() {
        // 每10秒发送一次心跳
        if (this.timeid) {
            clearInterval(this.timeid);
        }
        this.timeid = setInterval(() => {
            if (this.isopen && this.iscontent) {
                this.sendHeartBeat();
            }
        }, 10000);
    }

    sendToServer(xyname: string, data: any, callBack?: (data: any) => void) {
        this.session++;
        if (callBack) {
            this.callBacks[this.session] = callBack;
        }
        this.request && this.sendMessage(this.request(xyname, data, this.session));
    }

    sendMessage(message: any) {
        this.socket && this.socket.sendMessage(message);
    }

    // type
    // session
    // result
    dispatchMessage(response: any) {
        if (response.type == "RESPONSE") {
            this.callBacks && this.callBacks[response.session] && this.callBacks[response.session](response.result);
        } else if (response.type == "REQUEST") {
            if (response.pname == 'reportContent') {
                this.onReportContent(response);
                return
            } else {
                // 回调
                this.onReport(response.pname, response.result);
            }
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

    onReportContent(message: any) {
        if (message.result.code) {
            this.iscontent = true;
            //this.content();
            this.callBackContent && this.callBackContent(true);
        } else {
            this.iscontent = false;
            this.callBackContent && this.callBackContent(false);
        }
    }

    onOpen(event: any) {
        log('SocketManager onOpen', event);
        this.isopen = true;
    }

    onMessage(message: Uint8Array) {
        log('SocketManager onMessage', message);
        const response = this.client.dispatch(message);
        log('SocketManager onMessage response', response);
        this.dispatchMessage(response);
    }

    onClose(event: any) {
        log('SocketManager onClose', event);
        this.isopen = false;
        this.iscontent = false;
    }

    onError(event: any) {
        log('SocketManager onError', event);
    }
}
