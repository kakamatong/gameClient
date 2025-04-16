import { Socket } from '../frameworks/socket/socket';
import {assetManager,BufferAsset,log} from 'cc';
import sproto from './sproto/sproto.js';
import { handleSocketMessage, RESPONSE } from './config/config';
import { DataCenter } from '../datacenter/datacenter';
export class SocketManager implements handleSocketMessage {
    private socket: Socket | null = null;
    private request: any;
    private client: any;
    private bloaded = false;
    private iscontent = false;
    private isopen = false;
    private session = 0;
    private timeid:number = -1;
    private callBacks:Array<(data:any)=>void> = [];
    //单例
    private static _instance: SocketManager;
    public static get instance(): SocketManager {
        if (!this._instance) {
            this._instance = new SocketManager();
        }
        return this._instance;
    }

    initSocket(url:string){
        this.session = 0;
        this.iscontent = false;
        this.isopen = false;
        const socket = new Socket();
        socket.init(url);
        socket.setHandleMessage(this);
        return socket;
    }

    start(url:string){
        this.socket = this.initSocket(url);
    }
    
    loadProtocol(callBack:()=>void) {
        if(this.bloaded){
            callBack && callBack();
            return
        }
        const bundle = assetManager.loadBundle('protocol', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }

            // 必须先读取服务端协议
            bundle.load('s2c',(err,asset:BufferAsset) => {
                log('loadAsset error', err);

                const buffer = new Uint8Array(asset.buffer());
                const serverSproto = sproto.createNew(buffer);
                this.client = serverSproto.host('package');

                // 然后读取客户端协议
                bundle.load('c2s',(err,asset:BufferAsset) => {
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

    content() {
        const loginInfo = DataCenter.instance.getLoginInfo();
        log('SocketManager loginInfo', loginInfo);
        const contentInfo = {
            username: loginInfo.username,
            userid: loginInfo.userid,
            password: loginInfo.token,
            device: 'pc',
            version: '0.0.1'
        }
        this.sendToServer('auth', contentInfo, (data:any)=>{
            if(data.code){
                this.iscontent = true;
                log('认证成功');
                this.startHeartBeat();
            }
        })
    }

    sendHeartBeat() {
        this.sendToServer('heartbeat', {timestamp: Date.now() / 1000}, (data:any)=>{
            log("心跳 ",data.timestamp)
        }); 
    }

    startHeartBeat(){
       // 每10秒发送一次心跳
        if(this.timeid){
            clearInterval(this.timeid); 
        }
        this.timeid = setInterval(() => {
            if(this.isopen && this.iscontent){
                this.sendHeartBeat();
            }
        }, 10000); 
    }

    sendToServer(xyname:string,data: any, callBack?:(data:any)=>void){
        const tmpSession = this.session + 1;
        if(callBack){
            this.callBacks[tmpSession] = callBack;
        }
        this.request && this.sendMessage(this.request(xyname, data, tmpSession));
    }
    
    sendMessage(message: any) {
        this.socket && this.socket.sendMessage(message);
    }

    // type
    // session
    // result
    dispatchMessage(response: any) {
        if(response.type == "RESPONSE"){
            this.callBacks && this.callBacks[response.session] && this.callBacks[response.session](response.result);
        }else if(response.type == "REQUEST"){
            if(response.pname == 'reportContent'){
                this.onReportContent(response);
                return
            }else{
                // 回调
            }
        }
    }

    onReportContent(message: any) {
        if(message.result.code){
            this.iscontent = true;
            this.content();
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
