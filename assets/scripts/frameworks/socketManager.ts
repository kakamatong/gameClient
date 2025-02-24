import { Socket } from '../frameworks/socket/socket';
import {assetManager,BufferAsset,log} from 'cc';
import sproto from './sproto/sproto.js';
import { handleSocketMessage } from './config/config';
export class SocketManager implements handleSocketMessage {
    private socket: Socket | null = null;
    private request: any;
    private client: any;
    //单例
    public static instance: SocketManager;

    static createInstance() {
        SocketManager.instance = new SocketManager();
    }

    initSocket(url:string){
        const socket = new Socket();
        socket.init(url);
        socket.setHandleMessage(this);
        return socket;
    }

    start(url:string){
        this.socket = this.initSocket(url);
    }
    
    loadProtocol() {
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
                });
            });
        });
    }

    
    sendMessage(message: any) {
        this.socket && this.socket.sendMessage(message);
    }

    onOpen(event: any) {
        log('SocketManager onOpen', event);
    }

    onMessage(message: Uint8Array) {
        log('SocketManager onMessage', message);
        const response = this.client.dispatch(message);
        log('SocketManager onMessage response', response);
    }

    onClose(event: any) {
        log('SocketManager onClose', event);
    }

    onError(event: any) {
        log('SocketManager onError', event);
    }
}
