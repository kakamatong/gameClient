/**
 * @file RevokeAccount.ts
 * @description 账号注销模块：处理账号注销和取消注销请求
 * @category 网络请求模块
 */

import { CancelrevokeaccResponse, RevokeaccResponse } from '../../types/protocol/lobby/c2s';
import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { SprotoRevokeAcc, SprotoCancelRevokeAcc } from '../../types/protocol/lobby/c2s';


/**
 * @class RevokeAccount
 * @description 账号注销管理类，负责账号注销和取消注销操作
 * @category 网络请求模块
 */
export class RevokeAccount {
    /** 回调函数 */
    private _callback: ((data:any)=>void) | null = null;
    /**
     * @description 请求账号注销
     * @param callback 回调函数
     */
    reqRevokeAccount(callback?: (data:any)=>void) {
        if (callback) {
            this._callback = callback
        }
        const loginInfo = DataCenter.instance.getLoginInfo();
        LobbySocketManager.instance.sendToServer(SprotoRevokeAcc, { loginType: loginInfo?.loginType }, this.respRevoke.bind(this))
    }

    /**
     * @description 请求取消账号注销
     * @param callback 回调函数
     */
    reqCancelRevokeAccount(callback?: (data:any)=>void) {
        if (callback) {
            this._callback = callback
        }
        const loginInfo = DataCenter.instance.getLoginInfo();
        LobbySocketManager.instance.sendToServer(SprotoCancelRevokeAcc, { userid: loginInfo?.loginType }, this.respCancelRevoke.bind(this))
    }

    /**
     * @description 处理账号注销响应
     * @param data 服务器返回的注销结果
     */
    respRevoke(data: SprotoRevokeAcc.Response) {
        this._callback && this._callback(data);
    }

    /**
     * @description 处理取消账号注销响应
     * @param data 服务器返回的取消注销结果
     */
    respCancelRevoke(data: SprotoCancelRevokeAcc.Response) {
        this._callback && this._callback(data);
    }
}