/**
 * @file AuthGame.ts
 * @description 游戏认证模块：处理游戏服务器连接认证
 * @category 网络请求模块
 */

import CryptoJS from 'crypto-js';
import {DataCenter} from '../datacenter/Datacenter';
import { LogColors } from '../frameworks/Framework';
import { GameSocketManager } from '../frameworks/GameSocketManager';
import { CustomDESEncryptStr } from '../frameworks/utils/Utils';
import { BaseModule } from '../frameworks/base/BaseModule';

/**
 * @class AuthGame
 * @description 游戏服务器认证管理类，负责连接游戏服务器并完成认证，使用单例模式
 * @category 网络请求模块
 * @singleton 单例模式
 */
export class AuthGame extends BaseModule {
    /** 单例实例 */
    private static _instance: AuthGame;
    /** 认证回调函数 */
    private _callBack:((success:boolean)=>void) | null = null;

    /**
     * @description 获取 AuthGame 单例实例
     * @returns AuthGame 单例实例
     */
    public static get instance(): AuthGame {
        if (!this._instance) {
            this._instance = new AuthGame();
        }
        return this._instance;
    }

    /**
     * @description 请求游戏服务器认证
     * @param addr 服务器地址
     * @param gameid 游戏ID
     * @param roomid 房间ID
     * @param callBack 回调函数
     */
    req(addr:string,gameid:number,roomid:string,callBack:(success:boolean)=>void){
        this._callBack = callBack;
        GameSocketManager.instance.loadProtocol("game10001",()=>{
            const loginInfo = DataCenter.instance.getLoginInfo();
            const loginData = {
                device:'pc',
                version:'0.0.1',
                channel:'account',
                subid:loginInfo?.subid ?? '',
                time: Date.now(),
                username:loginInfo?.username ?? '',
            }
            let str = JSON.stringify(loginData)
            const secret = CryptoJS.enc.Hex.parse(loginInfo?.token ?? "")
            const token = CustomDESEncryptStr(str, secret)
            const urlToken = encodeURIComponent(token)

            const params = `ver=1&userid=${loginInfo?.userid ?? ''}&gameid=${gameid}&roomid=${roomid}&token=${urlToken}`
            const newAddr = DataCenter.instance.gameAuthList[addr];

            const url = `${newAddr}?${params}`
            GameSocketManager.instance.start(url, undefined, this.resp.bind(this))
        })
    }

    /**
     * @description 处理游戏认证响应
     * @param success 认证是否成功
     */
    resp(success:boolean){
        if(success){
            DataCenter.instance.addSubid();
            console.log(LogColors.green("连接游戏服务成功"))
        }else{
            console.log(LogColors.red("连接游戏服务失败"))
        }
        this._callBack && this._callBack(success);
    }
}