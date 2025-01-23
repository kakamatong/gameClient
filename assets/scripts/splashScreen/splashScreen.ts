import { _decorator, Component, log,sys,assetManager,BufferAsset} from 'cc';
import { Socket } from '../frameworks/socket/socket';
import sproto from '../frameworks/sproto/sproto.js';
import { handleSocketMessage } from '../frameworks/config/config';

const { ccclass, property } = _decorator;

@ccclass('splashScreen')
export class splashScreen extends Component implements handleSocketMessage {
    private socket: Socket;
    private request: any;
    private response: any;
    private client: any;
    private server: any;
    start() {
        log('splashScreen');
        this.socket = new Socket();
        this.socket.init();
        this.socket.setHandleMessage(this);
        this.loadProtocol();
    }

    sendLogin() {
        // username 0 : string
        // password 1 : string
        // device 2 : string
        // version 3 : string
        console.log('sendLogin');
        const loginInfo = {
            username: 'admin',
            password: '123456',
            device: 'pc',
            version: '0.0.1'
        }
        this.request && this.sendMessage(this.request('auth', loginInfo, 1));
    }

    sendMessage(message: any) {
        this.socket.sendMessage(message);
    }

    loadProtocol() {

        const bundle = assetManager.loadBundle('protocol', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }
            bundle.load('c2s',(err,asset:BufferAsset) => {
                log('loadAsset error', err);

                const buffer = new Uint8Array(asset.buffer());
                const clientSproto = sproto.createNew(buffer);
                this.client = clientSproto.host('package');
                this.request = this.client.attach(clientSproto);
            });

            bundle.load('s2c',(err,asset:BufferAsset) => {
                log('loadAsset error', err);

                const buffer = new Uint8Array(asset.buffer());
                const serverSproto = sproto.createNew(buffer);
                this.server = serverSproto.host('package');
                this.response = this.server.attach(serverSproto);
            });
        });
        // 读取协议文件
        //const protocolData = readFileSync(protocolPath);
        //Sproto.createNew(protocolData);
    }

    update(deltaTime: number) {
        
    }

    onOpen(event: any) {
        log('onOpen', event);
        setTimeout(() => {
            this.sendLogin();
        }, 1000);
    }

    onMessage(message: Uint8Array) {
        log('onMessage', message);
        const response = this.client.dispatch(message);
        log('response', response);
    }

    onClose(event: any) {
        log('onClose', event);
    }

    onError(error: any) {
        log('onError', error);
    }
}


