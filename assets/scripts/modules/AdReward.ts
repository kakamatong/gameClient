/**
 * @file AdReward.ts
 * @description 广告奖励模块：处理每日看广告领奖的相关请求
 * @category 网络请求模块
 */

import { SprotoCallActivityFunc } from "../../types/protocol/lobby/c2s";
import { LogColors } from "../frameworks/Framework";
import { DataCenter } from "../datacenter/Datacenter";
import { AD_REWARD_INFO, AD_RECEIVE_REWARD_RESULT } from "../datacenter/InterfaceConfig";
import { BaseModule } from "../frameworks/base/BaseModule";


/**
 * @class AdReward
 * @description 广告奖励管理类，负责请求广告信息、领取广告奖励
 * @category 网络请求模块
 */
export class AdReward extends BaseModule {

    /** 获取广告信息的回调函数 */
    private _getAdInfoCallBack: ((success: boolean, data: any) => void) | null = null;
    /** 领取广告奖励的回调函数 */
    private _receiveAdRewardCallBack: ((success: boolean, data: any) => void) | null = null;

    /**
     * 请求每日看广告领奖信息
     * @param callBack 回调函数
     */
    reqGetAdInfo(callBack: (success: boolean, data: any) => void){
        this._getAdInfoCallBack = callBack;
        this.reqLobby(SprotoCallActivityFunc, {moduleName : 'ad', funcName : 'getAdInfo', args:JSON.stringify({})}, this.respGetAdInfo.bind(this))
    }

    /**
     * @description 处理获取广告信息的响应回调
     * @param result 服务器返回的广告信息
     */
    respGetAdInfo(result: SprotoCallActivityFunc.Response): void {
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._getAdInfoCallBack && this._getAdInfoCallBack(false, res)
            }else{
                DataCenter.instance.adRewardInfo = res;
                this._getAdInfoCallBack && this._getAdInfoCallBack(true, res)
            }
        }else{
            this._getAdInfoCallBack && this._getAdInfoCallBack(false, null)
        }
    }

    /**
     * 领取看广告奖励
     * @param callBack 回调函数
     */
    reqReceiveAdReward(callBack: (success: boolean, data: any) => void){
        this._receiveAdRewardCallBack = callBack;
        this.reqLobby(SprotoCallActivityFunc, {moduleName : 'ad', funcName : 'getAdReward', args:JSON.stringify({})}, this.respReceiveAdReward.bind(this))
    }

    /**
     * @description 处理领取广告奖励的响应回调
     * @param result 服务器返回的领取结果
     */
    respReceiveAdReward(result: SprotoCallActivityFunc.Response): void {
        if(result && result.code == 1){
            const res = JSON.parse(result.result);
            if(res.error){
                console.log(LogColors.red(res.error));
                this._receiveAdRewardCallBack && this._receiveAdRewardCallBack(false, res)
            }else{
                const rewardRes = res as AD_RECEIVE_REWARD_RESULT;
                const adRewardInfo = DataCenter.instance.adRewardInfo;
                if(adRewardInfo){
                    adRewardInfo.currentRewardCount = rewardRes.currentRewardCount;
                    adRewardInfo.canReward = rewardRes.currentRewardCount < rewardRes.maxDailyRewardCount;
                }
                this._receiveAdRewardCallBack && this._receiveAdRewardCallBack(true, res)
            }
        }else{
            this._receiveAdRewardCallBack && this._receiveAdRewardCallBack(false, null)
        }
    }
}
