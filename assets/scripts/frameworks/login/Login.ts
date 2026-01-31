/**
 * @file Login.ts
 * @description 登录处理：处理用户登录认证流程
 * @category 核心框架
 */

import CryptoJS from 'crypto-js';
import { _decorator, log} from 'cc';
import { Socket } from '../socket/Socket';
import { handleSocketMessage } from '../config/Config';
import { dhexchange, dhsecret, hmac64, CustomDESEncrypt, StringToUint8Array, DecodeBase64Node } from '../utils/Utils';
import {LogColors} from '../Framework';
const { ccclass, property } = _decorator;

/**
 * @interface ACCOUNT_INFO
 * @description 账号信息接口
 */
export interface ACCOUNT_INFO {
    username: string;
    password: string;
    server: string;
    loginType?: string;
}

/**
 * @class Login
 * @description 登录处理类，处理用户登录认证流程
 * @category 核心框架
 * @implements handleSocketMessage
 */
@ccclass('Login')
export class Login implements handleSocketMessage {
    /** Socket 实例 */
    private _socket: Socket | null = null;
    /** 登录消息 */
    private _loginMsg:string = '';
    /** 当前步骤 ID */
    private _stepid = 0
    /** 客户端私钥 */
    private _clientPrivateKey: CryptoJS.WordArray | null = null;
    /** 服务器挑战 */
    private _challenge: CryptoJS.WordArray | null = null;
    /** 登录信息 */
    private _loginInfo:any = {
        username:'',
        userid:0,
        password:'',
        server:'',
        loginType:'',
        token:'',
        subid:0
    };
    /** 登录回调 */
    private _callBack:(b:boolean,data?:any)=>void = (b:boolean,data?:any)=>{};
    /** 账号信息 */
    private _accountInfo: ACCOUNT_INFO | null = null;
    /** 登录 URL 列表 */
    private _loginUrls:{[key:string]:string} = {};

    /**
     * @description 开始登录流程
     * @param acc 账号信息
     * @param urls 登录服务器地址列表
     * @param func 登录结果回调
     */
    start(acc: ACCOUNT_INFO, urls:{[key:string]:string}, func:(b:boolean,data?:any)=>void) {
        this._accountInfo = acc;
        this._loginUrls = urls;
        this._callBack = func;
        //console.log('login');
        this.encode_token();
        this.initSocket();
    }

    /**
     * @description 编码登录 token
     */
    encode_token(){
        if(!this._accountInfo){
            this._callBack && this._callBack(false);
            return;
        }
        const strUser = this._accountInfo.username;
        const strPassword = this._accountInfo.password;
        const strServer = this._accountInfo.server;
        const strLogintype = this._accountInfo.loginType;
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

    /**
     * @description 获取登录服务器 URL
     * @returns 登录服务器 URL
     */
    getLoginUrl(){
        const loginList = this._loginUrls;
        const keys = Object.keys(loginList);
        if (keys.length === 0) return undefined;
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return loginList[randomKey];
    }

    /**
     * @description 初始化 Socket 连接
     */
    initSocket() {
        this._socket = new Socket();
        this._socket.init(this.getLoginUrl() ?? "");
        this._socket.setHandleMessage(this);
    }

    /**
     * @description 发送消息
     * @param message 消息内容
     */
    sendMessage(message: any) {
        this._socket && this._socket.sendMessage(message);
    }

    /**
     * @description 处理连接打开事件
     * @param event 打开事件
     */
    onOpen(event: any) {
        log('onOpen', event);
    }

    /**
     * @description 处理接收消息事件
     * @param message 消息字节数组
     */
    onMessage(message: Uint8Array) {
        // const textDecoder = new TextDecoder('utf-8');
        // const text = textDecoder.decode(message);
        // 不使用TextDecoder，将message 转成string
        let encodedString = String.fromCharCode.apply(null, Array.from(message));
        let text = decodeURIComponent(escape(encodedString));

        //log('onMessage', text);

        if(text.includes(' ')){
            const infos = text.split(' ');
            const code = infos[0];
            if(code === '200'){
                const msg = DecodeBase64Node(infos[1]);
                const msg2 = DecodeBase64Node(infos[2]);
                const svr = DecodeBase64Node(infos[3]);
                log(LogColors.green('登录成功'))
                this._loginInfo.subid = Number(msg);
                this._loginInfo.userid = Number(msg2);
                this._loginInfo.server = svr;
                this._callBack(true,this._loginInfo);
            }else if(code === "403"){
                log('登录失败code:', code);
                this._callBack(false);
            }
            else{
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

    /**
     * @description 处理连接关闭事件
     * @param event 关闭事件
     */
    onClose(event: any) {
        log('onClose', event);
    }

    /**
     * @description 处理错误事件
     * @param error 错误信息
     */
    onError(error: any) {
        log('onError', error);
    }

    /**
     * @description 认证流程第一步：发送客户端公钥
     * @param message 服务器发送的 challenge
     */
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
        const messageBytes = StringToUint8Array(messageReq);
        const messageArray = Array.from(messageBytes);
        this.sendMessage(messageArray);
    }

    /**
     * @description 认证流程第二步：计算共享密钥并发送认证信息
     * @param message 服务器发送的公钥
     */
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
        const hmacB64Bytes = StringToUint8Array(hmacB64);
        const hmacB64Array = Array.from(hmacB64Bytes);
        this.sendMessage(hmacB64Array);
    
        //secret = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));
        const encryptedToken = CustomDESEncrypt(this._loginMsg, secret);
        this.sendMessage(encryptedToken);
    }

}
