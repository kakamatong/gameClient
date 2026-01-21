import { DispatchEvent } from './Framework';
import { SocketManager } from './SocketManager';
import { EVENT_NAMES } from '../datacenter/CommonConfig';

export class LobbySocketManager extends SocketManager {
    protected _name: string = 'LobbySocketManager'
    //单例
    private static _instance: LobbySocketManager;
    public static get instance(): LobbySocketManager {
        if (!this._instance) {
            this._instance = new LobbySocketManager();
        }
        return this._instance;
    }

    constructor(){
        super();
    }

    onClose(event: any) {
        if (this.isOpen()) {
            // 断线了
            DispatchEvent(EVENT_NAMES.SOCKET_DISCONNECT,{})
        }
        super.onClose(event);
    }
}