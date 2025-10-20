import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { DispatchEvent } from '../frameworks/Framework';
import { MAIN_GAME_ID } from '../datacenter/InterfaceConfig';

/**
 * @class UserData
 * @description 用户数据管理类，负责用户数据的请求和响应处理
 * @category 业务模块
 */
export class UserGameRecord {

    private _callback: ((data:any)=>void) | null = null;
    /**
     * @method req
     * @description 请求用户数据，向服务器发送用户数据请求
     */
    req(userid?:number, callback?: (data:any)=>void) {
        if (callback) {
            this._callback = callback
        }
        LobbySocketManager.instance.sendToServer('userGameRecord', { userid: userid  || DataCenter.instance.userid, gameid: MAIN_GAME_ID }, this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理用户数据响应，更新本地数据并发送事件通知
     * @param {any} data - 服务器返回的用户数据
     */
    resp(data: any) {
        DataCenter.instance.gameRecords = data;
        this._callback && this._callback(data);
    }
}