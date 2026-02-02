/**
 * @file AwardNotices.ts
 * @description 奖励通知模块：处理奖励通知的获取和标记已读
 * @category 网络请求模块
 */

import { DataCenter } from '../datacenter/Datacenter';
import { SprotoGetAwardNotice,SprotoSetAwardNoticeRead } from '../../types/protocol/lobby/c2s';
import { BaseModule } from '../frameworks/base/BaseModule';

/**
 * @class AwardNotices
 * @description 奖励通知管理类，负责获取奖励通知和标记已读
 * @category 网络请求模块
 */
export class AwardNotices extends BaseModule {
    /**
     * @description 请求获取奖励通知
     */
    req() {
        this.reqLobby(SprotoGetAwardNotice, { userid:DataCenter.instance.userid}, this.resp.bind(this))

    }

    /**
     * @description 处理奖励通知响应
     * @param data 服务器返回的奖励通知数据
     */
    resp(data: SprotoGetAwardNotice.Response) {
        // 这是未通知到的奖励，可以一个一个通知，或者合并通知
        data && data.list && console.log(data.list)
    }

    /**
     * @description 标记奖励通知为已读
     * @param id 奖励通知ID
     */
    reqRead(id:number){
        this.reqLobby(SprotoSetAwardNoticeRead, { id:id})
    }

}