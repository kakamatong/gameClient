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

    callServer(moduleName: string, funcName: string, args:any, callBack?: (data: any) => void){
        const strArgs = JSON.stringify(args)
        const data = {
            moduleName: moduleName,
            funcName:funcName,
            args: strArgs
        }
        this.sendToServer('call', data, callBack)
    }

    sendServer(moduleName: string, funcName: string, args:any){
        const strArgs = JSON.stringify(args)
        const data = {
            moduleName: moduleName,
            funcName:funcName,
            args: strArgs
        }
        this.sendToServer('send', data)
    }
}