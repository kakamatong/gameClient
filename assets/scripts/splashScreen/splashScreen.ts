import { _decorator, Component, log,sys,assetManager,BufferAsset,AssetManager} from 'cc';
import * as fgui from "fairygui-cc";
import { Socket } from '../frameworks/socket/socket';
import sproto from '../frameworks/sproto/sproto.js';
import { handleSocketMessage } from '../frameworks/config/config';
import { Login } from '../login/login';
import testBinder from '../fgui/test/testBinder';
import TestView from '../view/TestView';
const { ccclass, property } = _decorator;

@ccclass('splashScreen')
export class splashScreen extends Component implements handleSocketMessage {
    private socket: Socket;
    private request: any;
    private response: any;
    private client: any;
    private server: any;
    start() {
        assetManager.loadBundle('fgui', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }
            this.initView();
        });
        log('splashScreen');
        //this.loadProtocol();

        // setTimeout(() => {
        //     this.initSocket();
        // }, 1000);
        // const login = new Login();
        // login.start();
    }

    initView(){
        fgui.GRoot.create()
        //testBinder.bindAll();
        const bundle = assetManager.getBundle('fgui') as AssetManager.Bundle;
        fgui.UIPackage.loadPackage(bundle, 'test', (error, pkg)=>{
            if(error){
                log('loadPackage error', error);
                return;
            }
            const view = fgui.UIPackage.createObject('test', 'TestView', TestView);
            fgui.GRoot.inst.addChild(view);
        });
    }

    initSocket() {
        this.socket = new Socket();
        this.socket.init();
        this.socket.setHandleMessage(this);
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
        this.request && this.sendMessage(this.request('auth', loginInfo, 100));
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
        // 读取协议文件
        //const protocolData = readFileSync(protocolPath);
        //Sproto.createNew(protocolData);
    }

    update(deltaTime: number) {
        
    }

    onOpen(event: any) {
        log('onOpen', event);
        this.sendLogin();

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
