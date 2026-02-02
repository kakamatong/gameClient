import { LobbySocketManager } from "../LobbySocketManager";
import { GameSocketManager } from "../GameSocketManager";

export class BaseModule {
    private _instances = new Map<Function, any>();

    protected constructor() {}

    /**
     * 父类不再推导 this，而是完全听从传入的参数。
     * @param ctor 构造函数 (Map 的 Key)
     * @returns T (直接返回你传入的泛型类型)
     */
    protected _getInstance<T>(ctor: any): T {
        // 1. 如果 Map 里没有，就 new 一个
        if (!this._instances.has(ctor)) {
            // 这里的 new ctor() 需要 ctor 是 any 或者特定构造签名
            // 因为是 protected 构造函数，用 any 最省事且通用
            this._instances.set(ctor, new ctor());
        }

        // 2. 直接返回，类型就是你传进来的 T
        return this._instances.get(ctor);
    }

    protected reqLobby(proto: { Name: string }, data: any, callback?: (data: any) => void): void {
        LobbySocketManager.instance.sendToServer(proto, data, callback);
    }

    protected reqGame(proto: { Name: string }, data: any, callback?: (data: any) => void): void {
        GameSocketManager.instance.sendToServer(proto, data, callback);
    }
}
