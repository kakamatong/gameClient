/**
 * @file UserData.ts
 * @description 用户数据模块：处理用户数据的请求、更新和响应
 * @category 网络请求模块
 */

import { DataCenter } from '../datacenter/Datacenter';
import { LobbySocketManager } from '../frameworks/LobbySocketManager';
import { DispatchEvent } from '../frameworks/Framework';
import { SprotoUpdateUserNameAndHeadurl, SprotoUserData } from '../../types/protocol/lobby/c2s';
import { EVENT_NAMES } from '../datacenter/CommonConfig';

/**
 * @class UserData
 * @description 用户数据管理类，负责用户数据的请求和响应处理
 * @category 网络请求模块
 */
export class UserData {
    /**
     * @method req
     * @description 请求用户数据，向服务器发送用户数据请求
     */
    req() {
        LobbySocketManager.instance.sendToServer(SprotoUserData, { userid: DataCenter.instance.userid }, this.resp.bind(this))
    }

    /**
     * @method resp
     * @description 处理用户数据响应，更新本地数据并发送事件通知
     * @param {any} data - 服务器返回的用户数据
     */
    resp(data: SprotoUserData.Response) {
        DataCenter.instance.userData = data;
        DispatchEvent(EVENT_NAMES.USER_DATA,data)
    }

    /**
     * @description 更新用户昵称和头像
     * @param nickname 用户昵称
     * @param headurl 头像地址
     */
    updateUserNameAndHeadurl(nickname:string, headurl:string){
        LobbySocketManager.instance.sendToServer(SprotoUpdateUserNameAndHeadurl, { nickname: nickname, headurl: headurl })
    }
}