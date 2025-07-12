import { LogColors } from './framework';
import { SocketManager } from './socketManager';

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
}