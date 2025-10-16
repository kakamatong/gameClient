import { DispatchEvent, LogColors } from './Framework';
import { SocketManager } from './SocketManager';

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

    onOpen(event: any): void {
        super.onOpen(event);
        // 游戏区链接没有agent，所以打开socket后，直接通过成功
        this.agentReady(null);
    }

    onClose(event: any) {
        if (this.isOpen()) {
            // 断线了
            DispatchEvent('gameSocketDisconnect',{})
        }
        super.onClose(event);
    }
}