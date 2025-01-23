import { _decorator, Component, Node, log,assetManager,BufferAsset } from 'cc';
import { handleSocketMessage } from '../config/config';
const { ccclass, property } = _decorator;

@ccclass('Socket')
export class Socket {
    private socket: WebSocket;
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;
    private readonly reconnectDelay: number = 3000; // 重连延迟时间（毫秒）
    private handleSocketMessage: handleSocketMessage;
    init(url: string = 'ws://192.168.1.182:8001') {
        this.connectWebSocket(url);
    }

    setHandleMessage(handleSocketMessage: handleSocketMessage) {
        this.handleSocketMessage = handleSocketMessage;
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

            this.handleSocketMessage && this.handleSocketMessage.onOpen(event);
        };

        // 接收消息
        this.socket.onmessage = (event) => {
            try {
                // 直接处理二进制数据
                const uint8Array = new Uint8Array(event.data);
                this.handleSocketMessage && this.handleSocketMessage.onMessage(uint8Array);
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
                // 直接发送二进制数据
                const buffer = new Uint8Array(data);
                console.log('buffer:', buffer);
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