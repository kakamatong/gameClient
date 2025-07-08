import { SocketManager } from './socketManager';

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
}