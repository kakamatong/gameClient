import CryptoJS from 'crypto-js';        
import { _decorator, log} from 'cc';
import { Socket } from '../frameworks/socket/socket';
import { handleSocketMessage } from '../frameworks/config/config';
import { dhexchange, dhsecret, hmac64, customDESEncrypt } from '../frameworks/utils/utils';
import { LOGIN_INFO } from '../datacenter/interfaceConfig';
import { DataCenter } from '../datacenter/datacenter';
import {LogColors} from '../frameworks/framework';
const { ccclass, property } = _decorator;

export interface ACCOUNT_INFO {
    username: string;
    password: string;
    server?: string;
    loginType?: string;
}
@ccclass('Login')
export class Login implements handleSocketMessage {
    private _socket: Socket | null = null;
    private _loginMsg:string = '';
    private _stepid = 0
    private _clientPrivateKey: CryptoJS.WordArray | null = null;
    private _challenge: CryptoJS.WordArray | null = null;
    private _loginInfo:LOGIN_INFO = {
        username:'',
        userid:0,
        password:'',
        server:'',
        loginType:'',
        token:'',
        subid:0
    };
    private _callBack:(b:boolean)=>void = (b:boolean)=>{};
    private _accountInfo: ACCOUNT_INFO | null = null;


    start(acc: ACCOUNT_INFO,func:(b:boolean)=>void) {
        this._accountInfo = acc;
        this._callBack = func;
        //console.log('login');
        this.encode_token();
        this.initSocket();
    }

    // test001
    // wlj123456
    encode_token(){
        if(!this._accountInfo){
            this._callBack && this._callBack(false);
            return;
        }
        const strUser = this._accountInfo.username;
        const strPassword = this._accountInfo.password;
        const strServer = 'lobbyGate';
        const strLogintype = 'account';
        this._loginInfo.username = strUser;
        this._loginInfo.password = strPassword;
        this._loginInfo.server = strServer;
        this._loginInfo.loginType = strLogintype;
        const user = CryptoJS.enc.Utf8.parse(strUser).toString(CryptoJS.enc.Base64);
        const password = CryptoJS.enc.Utf8.parse(strPassword).toString(CryptoJS.enc.Base64);
        const server = CryptoJS.enc.Utf8.parse(strServer).toString(CryptoJS.enc.Base64);
        const logtinType = CryptoJS.enc.Utf8.parse(strLogintype).toString(CryptoJS.enc.Base64);
        const token = user + '@' + server + ':' + password + '#' + logtinType;
        
        //console.log('token:', token);
        this._loginMsg = token;
    }

    initSocket() {
        this._socket = new Socket();
        this._socket.init(DataCenter.instance.appConfig.loginUrl ?? "");
        this._socket.setHandleMessage(this);
    }

    sendMessage(message: any) {
        this._socket && this._socket.sendMessage(message);
    }

    onOpen(event: any) {
        log('onOpen', event);
    }

    onMessage(message: Uint8Array) {
        const textDecoder = new TextDecoder('utf-8');
        const text = textDecoder.decode(message);
        //log('onMessage', text);

        if(text.includes(' ')){
            const infos = text.split(' ');
            const code = infos[0];
            const msg = atob(infos[1]);
            const msg2 = atob(infos[2]);
            if(code === '200'){
                log(LogColors.green('登录成功'))
                this._loginInfo.subid = Number(msg);
                this._loginInfo.userid = Number(msg2);
                DataCenter.instance.setLoginInfo(this._loginInfo);
                this._callBack(true);
            }else{
                log('登录失败code:', code);
                this._callBack(false);
            }
            return;
        }
        if(this._stepid === 0) {
            this.performAuthentication1(text)
            this._stepid = 1;
        }else if(this._stepid === 1) {
            this.performAuthentication2(text)
            this._stepid = 2;
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
        //console.log('challengeB64:', challengeB64);
        this._challenge = CryptoJS.enc.Base64.parse(challengeB64.trim());
    
        // 生成客户端密钥对前添加日志
        this._clientPrivateKey = CryptoJS.lib.WordArray.random(8);
        //this._clientPrivateKey = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));

        if(!this._clientPrivateKey){
            return;
        }
        const clientPrivateKeyDh = dhexchange(this._clientPrivateKey);

        const clientPublicKeyB64 = CryptoJS.enc.Base64.stringify(clientPrivateKeyDh);
        const messageReq = clientPublicKeyB64
        //console.log('clientPublicKeyB64:', clientPublicKeyB64);

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
        if(!this._clientPrivateKey){
            return;
        }
        const secret = dhsecret(serverPublicKey, this._clientPrivateKey);
        //const secret = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));

        // 打印secret
        const secretHex = secret.toString(CryptoJS.enc.Hex);
        //console.log('secretHex:', secretHex);
        this._loginInfo.token = secretHex;
        // 5. 计算HMAC校验
        if(!this._challenge){
            return;
        }
        const hmac = hmac64(this._challenge, secret);
        //hmac.sigBytes = 8; // 截取前8字节
        const hmacB64 = CryptoJS.enc.Base64.stringify(hmac);
        //console.log('hmacB64:', hmacB64);
        
        // 将base64字符串转换为字节数组
        const hmacB64Bytes = new TextEncoder().encode(hmacB64);
        const hmacB64Array = Array.from(hmacB64Bytes);
        this.sendMessage(hmacB64Array);
    
        //secret = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));
        const encryptedToken = customDESEncrypt(this._loginMsg, secret);
        this.sendMessage(encryptedToken);
    }

}
