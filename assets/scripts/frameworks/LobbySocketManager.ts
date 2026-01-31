/**
 * @file LobbySocketManager.ts
 * @description 大厅 Socket 管理器：处理大厅服务器连接
 * @category 核心框架
 */

import { DispatchEvent } from './Framework';
import { SocketManager } from './SocketManager';
import { FW_EVENT_NAMES } from './config/Config';

/**
 * @class LobbySocketManager
 * @description 大厅 Socket 管理器，处理与大厅服务器的连接，使用单例模式
 * @category 核心框架
 * @extends SocketManager
 * @singleton 单例模式
 */
export class LobbySocketManager extends SocketManager {
    protected _name: string = 'LobbySocketManager'
    /** 单例实例 */
    private static _instance: LobbySocketManager;

    /**
     * @description 获取 LobbySocketManager 单例实例
     * @returns LobbySocketManager 单例实例
     */
    public static get instance(): LobbySocketManager {
        if (!this._instance) {
            this._instance = new LobbySocketManager();
        }
        return this._instance;
    }

    /**
     * @description 构造函数
     */
    constructor(){
        super();
    }

    /**
     * @description 处理连接关闭事件
     * @param event 关闭事件
     */
    onClose(event: any) {
        if (this.isOpen()) {
            // 断线了
            DispatchEvent(FW_EVENT_NAMES.SOCKET_DISCONNECT,{})
        }
        super.onClose(event);
    }
}