/**
 * @file UserGameRecord.ts
 * @description 用户游戏记录模块：处理用户游戏战绩的请求
 * @category 网络请求模块
 */

import { DataCenter } from '../datacenter/Datacenter';
import { MAIN_GAME_ID } from '../datacenter/InterfaceConfig';
import { SprotoUserGameRecord } from '../../types/protocol/lobby/c2s';
import { BaseModule } from '../frameworks/base/BaseModule';

/**
 * @class UserGameRecord
 * @description 用户游戏记录管理类，负责用户游戏战绩的请求和响应处理
 * @category 网络请求模块
 */
export class UserGameRecord extends BaseModule {

    /** 回调函数 */
    private _callback: ((data:any)=>void) | null = null;
    /**
     * @method req
     * @description 请求用户数据，向服务器发送用户数据请求
     */
    req(userid?:number, callback?: (data:any)=>void) {
        if (callback) {
            this._callback = callback
        }
        this.reqLobby(SprotoUserGameRecord, { userid: userid  || DataCenter.instance.userid, gameid: MAIN_GAME_ID }, this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理用户数据响应，更新本地数据并发送事件通知
     * @param {SprotoUserGameRecord} data - 服务器返回的用户数据
     */
    resp(data: SprotoUserGameRecord.Response) {
        DataCenter.instance.gameRecords = data;
        this._callback && this._callback(data);
    }
}