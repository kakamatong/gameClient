import CryptoJS from '../frameworks/libs/crypto-js-4.2.0/crypto-js.js';
import { _decorator, Component, log,sys,assetManager,BufferAsset} from 'cc';
import { Socket } from '../frameworks/socket/socket';
import { handleSocketMessage } from '../frameworks/config/config';
import { dhexchange, dhsecret, hmac64 } from '../frameworks/utils/utils';
const { ccclass, property } = _decorator;

@ccclass('Login')
export class Login implements handleSocketMessage {
    private socket: Socket;
    private stepid = 0
    private clientPrivateKey: CryptoJS.lib.WordArray;
    private challenge: CryptoJS.lib.WordArray;

    start() {
        console.log('login');
        this.initSocket();
    }

    initSocket() {
        this.socket = new Socket();
        this.socket.init('ws://192.168.1.182:8002');
        this.socket.setHandleMessage(this);
    }

    sendMessage(message: any) {
        this.socket.sendMessage(message);
    }

    onOpen(event: any) {
        log('onOpen', event);
    }

    onMessage(message: Uint8Array) {
        const textDecoder = new TextDecoder('utf-8');
        const text = textDecoder.decode(message);
        log('onMessage', text);
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
        this.challenge = CryptoJS.enc.Base64.parse(challengeB64.trim());
    
        // 打印challenge实际字节内容
        const challengeHex = this.challenge.toString(CryptoJS.enc.Hex);
        const challengeBytes = [];
        for (let i = 0; i < challengeHex.length; i += 2) {
            challengeBytes.push(parseInt(challengeHex.substr(i, 2), 16));
        }
        console.log('Challenge实际字节:', 
            `长度: ${this.challenge.sigBytes}字节`,
            `内容: [${challengeBytes.join(', ')}]`
        );
    
        // 生成客户端密钥对前添加日志
        //this.clientPrivateKey = CryptoJS.lib.WordArray.random(8);
        this.clientPrivateKey = CryptoJS.lib.WordArray.create(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));

        const clientPrivateKeyDh = dhexchange(this.clientPrivateKey);
        // 打印客户端公钥字节
        const publicKeyHex = clientPrivateKeyDh.toString(CryptoJS.enc.Hex);
        const publicKeyBytes = [];
        for (let i = 0; i < publicKeyHex.length; i += 2) {
            publicKeyBytes.push(parseInt(publicKeyHex.substr(i, 2), 16));
        }
        console.log('客户端公钥字节:', 
            `长度: ${clientPrivateKeyDh.sigBytes}字节`,
            `内容: [${publicKeyBytes.join(', ')}]`
        );

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

        // 打印secret
        const secretHex = secret.toString(CryptoJS.enc.Hex);
        console.log('secretHex:', secretHex);
        const secretBytes = [];
        for (let i = 0; i < secretHex.length; i += 2) {
            secretBytes.push(parseInt(secretHex.substr(i, 2), 16));
        }
        console.log('secret字节:', 
            `长度: ${secret.sigBytes}字节`,
            `内容: [${secretBytes.join(', ')}]`
        );
    
        // 5. 计算HMAC校验
        //const hmac = hmac64(this.challenge, secret);
        const hmac = hmac64(this.clientPrivateKey, secret);
        //hmac.sigBytes = 8; // 截取前8字节
        const hmacB64 = CryptoJS.enc.Base64.stringify(hmac);
        console.log('hmacB64:', hmacB64);
        const hmacB64Bytes = new TextEncoder().encode(hmacB64);
        const hmacB64Array = Array.from(hmacB64Bytes);
        this.sendMessage(hmacB64Array);
    
        // 6. 加密并发送token（DES-ECB + PKCS7）
        const encryptedToken = CryptoJS.DES.encrypt(
        CryptoJS.enc.Utf8.parse('user|timestamp|signature'),
        secret,
        { 
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7 
        }
        );

        const messageReq = encryptedToken.toString();
        // 将base64字符串转换为字节数组
        const messageBytes = new TextEncoder().encode(messageReq);
        const messageArray = Array.from(messageBytes);
        this.sendMessage(messageArray);   
    }
}
