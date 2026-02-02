/**
 * @file Rank.ts
 * @description 排行榜模块：处理排行榜数据的请求
 * @category 网络请求模块
 */

import { LogColors } from '../frameworks/Framework';
import { SprotoCallActivityFunc } from '../../types/protocol/lobby/c2s';
import { BaseModule } from '../frameworks/base/BaseModule';

/**
 * @class Rank
 * @description 排行榜管理类，负责请求排行榜数据
 * @category 网络请求模块
 */
export class Rank extends BaseModule {
    /** 回调函数 */
    private _callBack:((b:boolean, data:any)=>void) | null = null;

    /**
     * @description 请求排行榜数据
     * @param callBack 回调函数
     */
    req(callBack?:(b:boolean,data:any)=>void) {
        if (callBack) {
            this._callBack = callBack;
        }
        this.reqLobby(SprotoCallActivityFunc,{moduleName : 'gameRank', funcName : 'getRankList', args:JSON.stringify({})} , this.resp.bind(this))
    }

    /**
     * @description 处理排行榜数据响应
     * @param result 服务器返回的排行榜数据
     */
    resp(result: SprotoCallActivityFunc.Response) {
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._callBack && this._callBack(false, res)
            }else{
                this._callBack && this._callBack(true, res)
            }
        }else{
            this._callBack && this._callBack(false, null)
        }
    }
}