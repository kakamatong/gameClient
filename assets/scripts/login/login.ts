import CryptoJS from '../frameworks/libs/crypto-js-4.2.0/crypto-js.js';
import { _decorator, Component, log,sys,assetManager,BufferAsset} from 'cc';
import { Socket } from '../frameworks/socket/socket';
import { handleSocketMessage } from '../frameworks/config/config';
import { dhexchange, dhsecret, hmac64, customDESEncrypt } from '../frameworks/utils/utils';
const { ccclass, property } = _decorator;

@ccclass('Login')
export class Login implements handleSocketMessage {
    private socket: Socket | null = null;
    private loginMsg:string = '';
    private stepid = 0
    private clientPrivateKey: CryptoJS.lib.WordArray;
    private challenge: CryptoJS.lib.WordArray;
    private callBack:(b:boolean)=>void = (b:boolean)=>{};

    start(func:(b:boolean)=>void) {
        this.callBack = func;
        console.log('login');
        this.encode_token();
        this.initSocket();
    }


    encode_token(){
        const user = CryptoJS.enc.Utf8.parse('test001').toString(CryptoJS.enc.Base64);
        const password = CryptoJS.enc.Utf8.parse('wlj123456').toString(CryptoJS.enc.Base64);
        const server = CryptoJS.enc.Utf8.parse('lobbyGate').toString(CryptoJS.enc.Base64);
        const logtinType = CryptoJS.enc.Utf8.parse('account').toString(CryptoJS.enc.Base64);
        const token = user + '@' + server + ':' + password + '#' + logtinType;
        console.log('token:', token);
        this.loginMsg = token;
    }

    initSocket() {
        this.socket = new Socket();
        this.socket.init('ws://192.168.1.182:8002');
        this.socket.setHandleMessage(this);
    }

    sendMessage(message: any) {
        this.socket && this.socket.sendMessage(message);
    }

    onOpen(event: any) {
        log('onOpen', event);
    }

    onMessage(message: Uint8Array) {
        const textDecoder = new TextDecoder('utf-8');
        const text = textDecoder.decode(message);
        log('onMessage', text);

        if(text.includes(' ')){
            const infos = text.split(' ');
            const code = infos[0];
            const msg = infos[1];
            if(code === '200'){
                log('登录成功');
                this.callBack(true);
            }else{
                log('登录失败code:', code);
                this.callBack(false);
            }
            return;
        }
        if(this.stepid === 0) {
            this.performAuthentication1(text)
            this.stepid = 1;
        }else if(this.stepid === 1) {
            this.performAuthentication2(text)
            this.stepid = 2;
        }
    }

    onClose(event: any) {
        log('onClose', event);
    }

    onError(error: any) {
        log('onError', error);
    }
  
    // 认证流程主函数
    performAuthentication1(message: string) {
        // 1. 接收服务端发送的challenge（伪代码示例）
        const challengeB64 = message; // 接收base64字符串
        console.log('challengeB64:', challengeB64);
        this.challenge = CryptoJS.enc.Base64.parse(challengeB64.trim());
    
        // 生成客户端密钥对前添加日志
        this.clientPrivateKey = CryptoJS.lib.WordArray.random(8);
        //this.clientPrivateKey = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));

        const clientPrivateKeyDh = dhexchange(this.clientPrivateKey);

        const clientPublicKeyB64 = CryptoJS.enc.Base64.stringify(clientPrivateKeyDh);
        const messageReq = clientPublicKeyB64
        console.log('clientPublicKeyB64:', clientPublicKeyB64);

        // 将base64字符串转换为字节数组
        const messageBytes = new TextEncoder().encode(messageReq);
        const messageArray = Array.from(messageBytes);
        this.sendMessage(messageArray);
    }

    // 认证流程主函数
    performAuthentication2(message: string) {
        // 3. 接收服务端公钥
        const serverPublicKeyB64 = message;
        const serverPublicKey = CryptoJS.enc.Base64.parse(serverPublicKeyB64.trim());
    
        // 4. 计算共享密钥（根据服务端实现调整）
        const secret = dhsecret(serverPublicKey, this.clientPrivateKey);
        //const secret = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));

        // 打印secret
        const secretHex = secret.toString(CryptoJS.enc.Hex);
        console.log('secretHex:', secretHex);
    
        // 5. 计算HMAC校验
        const hmac = hmac64(this.challenge, secret);
        //hmac.sigBytes = 8; // 截取前8字节
        const hmacB64 = CryptoJS.enc.Base64.stringify(hmac);
        console.log('hmacB64:', hmacB64);
        const hmacB64Bytes = new TextEncoder().encode(hmacB64);
        const hmacB64Array = Array.from(hmacB64Bytes);
        this.sendMessage(hmacB64Array);
    
        //secret = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));
        const encryptedToken = customDESEncrypt(this.loginMsg, secret);
        this.sendMessage(encryptedToken);
    }

}
