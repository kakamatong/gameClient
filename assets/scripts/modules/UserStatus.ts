/**
 * @file UserStatus.ts
 * @description 用户状态模块：处理用户状态数据的请求和响应
 * @category 网络请求模块
 */

import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { DispatchEvent } from '../frameworks/Framework';
import { SprotoUserStatus } from '../../types/protocol/lobby/c2s';
import { EVENT_NAMES } from '../datacenter/CommonConfig';

/**
 * @class UserStatus
 * @description 用户状态管理类，负责请求和更新用户状态数据
 * @category 网络请求模块
 */
export class UserStatus {
    /**
     * @description 请求用户状态数据
     */
    req() {
        LobbySocketManager.instance.sendToServer(SprotoUserStatus, { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    /**
     * @description 处理用户状态数据响应
     * @param data 服务器返回的用户状态数据
     */
    resp(data: SprotoUserStatus.Response) {
        DataCenter.instance.userStatus = data;
        DispatchEvent(EVENT_NAMES.USER_STATUS,data)
    }
}