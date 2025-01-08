import { _decorator, Component, Node, log } from 'cc';
import { CryptoUtil } from '../utils/CryptoUtil';
const { ccclass, property } = _decorator;

@ccclass('Socket')
export class Socket {
    private socket: WebSocket;
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;
    private readonly reconnectDelay: number = 3000; // 重连延迟时间（毫秒）
    private readonly secretKey: string = 'your16bytesecret'; // 16字节的密钥

    init(url: string = 'ws://192.168.1.182:8001') {
        this.connectWebSocket(url);
    }

    private connectWebSocket(url: string) {
        try {
            this.socket = new WebSocket(url);
            this.socket.binaryType = 'arraybuffer';
            this.setupEventListeners();
        } catch (error) {
            log('WebSocket 连接创建失败:', error);
            this.handleReconnection();
        }
    }

    private setupEventListeners() {
        // 连接成功
        this.socket.onopen = (event) => {
            log('WebSocket 连接成功！');
            this.reconnectAttempts = 0;
        };

        // 接收消息
        this.socket.onmessage = (event) => {
            try {
                // 将ArrayBuffer转换为Uint8Array
                const uint8Array = new Uint8Array(event.data);
                
                // 转换为字符串进行解密
                const rawData = String.fromCharCode.apply(null, Array.from(uint8Array));
                const decryptedData = CryptoUtil.decrypt(rawData, this.secretKey);
                
                // 转回数字数组
                const resultArray = new Uint8Array(
                    decryptedData.split('').map(char => char.charCodeAt(0))
                );
                
                this.handleMessage(Array.from(resultArray));
            } catch (error) {
                log('消息解析错误:', error);
            }
        };

        // 连接关闭
        this.socket.onclose = (event) => {
            log('WebSocket 连接关闭:', event.code, event.reason);
            this.handleReconnection();
        };

        // 错误处理
        this.socket.onerror = (error) => {
            log('WebSocket 错误:', error);
        };
    }

    private handleReconnection() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            log(`尝试重新连接... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.init();
            }, this.reconnectDelay);
        } else {
            log('达到最大重连次数，连接失败');
        }
    }

    private handleMessage(message: Array<number>) {
        // 处理接收到的消息
        log('收到消息:', message);
        // TODO: 根据消息类型进行处理
    }

    // 发送消息方法
    public sendMessage(data: Array<number>) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            try {
                // 将数字数组转换为 Uint8Array
                const uint8Array = new Uint8Array(data);
                
                // 加密二进制数据
                const rawData = String.fromCharCode.apply(null, Array.from(uint8Array));
                const encryptedData = CryptoUtil.encrypt(rawData, this.secretKey);
                
                // 将加密后的数据转回二进制
                const encoder = new TextEncoder();
                const buffer = encoder.encode(encryptedData);
                
                this.socket.send(buffer);
            } catch (error) {
                log('消息发送失败:', error);
            }
        } else {
            log('WebSocket未连接，无法发送消息');
        }
    }

    // 主动关闭连接
    public closeConnection() {
        if (this.socket) {
            this.socket.close();
        }
    }

    // 检查连接状态
    public isConnected(): boolean {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }
}