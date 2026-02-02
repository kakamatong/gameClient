/**
 * @file UserRiches.ts
 * @description 用户财富模块：处理用户财富数据的请求和响应
 * @category 网络请求模块
 */

import { SprotoUserRiches } from '../../types/protocol/lobby/c2s';
import { DataCenter } from '../datacenter/Datacenter';
import { DispatchEvent } from '../frameworks/Framework';
import { EVENT_NAMES } from '../datacenter/CommonConfig';
import { BaseModule } from '../frameworks/base/BaseModule';

/**
 * @class UserRiches
 * @description 用户财富管理类，负责请求和更新用户财富数据
 * @category 网络请求模块
 */
export class UserRiches extends BaseModule {
    static get instance(): UserRiches {
        return this._getInstance<UserRiches>(UserRiches);
    }
    /**
     * @description 请求用户财富数据
     */
    req() {
        this.reqLobby(SprotoUserRiches, {}, this.resp.bind(this))
    }

    /**
     * @description 处理用户财富数据响应
     * @param data 服务器返回的财富数据
     */
    resp(data: SprotoUserRiches.Response) {
        //DataCenter.instance.userData = data;
        if (data  && data.richType && data.richNums && data.richType.length > 0 && data.richNums.length > 0) {
            const riches: Array<{richType:number, richNums:number}> = []
            for (let i = 0; i < data.richType.length; i++) {
                const tmp = {
                    richType: data.richType[i],
                    richNums: data.richNums[i]
                }
                riches.push(tmp)
            }
            DataCenter.instance.userRiches = riches
            DispatchEvent(EVENT_NAMES.USER_RICHES,data)
        }
    }
}