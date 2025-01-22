import { _decorator, Component, log,sys,assetManager,BufferAsset} from 'cc';
import { Socket } from '../frameworks/socket/socket';
import sproto from '../frameworks/sproto/sproto.js';

const { ccclass, property } = _decorator;

@ccclass('splashScreen')
export class splashScreen extends Component {
    private socket: Socket;
    start() {
        log('splashScreen');
        this.socket = new Socket();
        this.socket.init();
        this.loadProtocol();
        setTimeout(() => {
            const protocolPath = '../protocol/sproto.spb';
            // 读取协议文件
            //const protocolData = readFileSync(protocolPath);
            //Sproto.createNew(protocolData);
            // socket.sendMessage({
            //     type: 'login',
            //     data: {
            //         username: 'admin',
            //         password: '123456'
            //     }
            // });
        }, 2000);
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
                const client = clientSproto.host('package');
                const request = client.attach(clientSproto);

                // username 0 : string
                // password 1 : string
                // device 2 : string
                // version 3 : string
                const loginInfo = {
                    username: 'admin',
                    password: '123456',
                    device: 'pc',
                    version: '0.0.1'
                }

                this.socket.sendMessage(request('auth', loginInfo));
            });

            bundle.load('s2c',(err,asset:BufferAsset) => {
                log('loadAsset error', err);

                const buffer = new Uint8Array(asset.buffer());
                const serverSproto = sproto.createNew(buffer);
                const server = serverSproto.host('package');

            });
        });
        // 读取协议文件
        //const protocolData = readFileSync(protocolPath);
        //Sproto.createNew(protocolData);
    }

    update(deltaTime: number) {
        
    }
}


