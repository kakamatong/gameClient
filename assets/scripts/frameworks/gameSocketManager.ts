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

    onOpen(event: any): void {
        console.log(LogColors.green("游戏服务 onOpen"))

        this._callBackLink &&  this._callBackLink(true)
    }
}