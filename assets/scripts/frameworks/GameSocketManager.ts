import { DispatchEvent, LogColors } from './Framework';
import { SocketManager } from './SocketManager';
import { EVENT_NAMES } from '../datacenter/CommonConfig';

export class GameSocketManager extends SocketManager {
    protected _name: string = 'GameSocketManager'
    //单例
    private static _instance: GameSocketManager;
    public static get instance(): GameSocketManager {
        if (!this._instance) {
            this._instance = new GameSocketManager();
        }
        return this._instance;
    }

    constructor(){
        super();
    }

    onOpen(event: any): void {
        super.onOpen(event);
        // 游戏区链接没有agent，所以打开socket后，直接通过成功
        this.agentReady(null);
    }

    onClose(event: any) {
        if (this.isOpen()) {
            // 断线了
            DispatchEvent(EVENT_NAMES.GAME_SOCKET_DISCONNECT,{})
        }
        super.onClose(event);
    }
}