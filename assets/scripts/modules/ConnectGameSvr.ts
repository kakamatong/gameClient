/**
 * @file ConnectGameSvr.ts
 * @description 游戏服务器连接模块：处理连接到游戏服务器和加入私密房间
 * @category 网络请求模块
 */

import { SprotoJoinPrivateRoom } from "../../types/protocol/lobby/c2s";
import { DataCenter } from "../datacenter/Datacenter";
import { LogColors } from "../frameworks/Framework";
import { AuthGame } from "./AuthGame";
import { BaseModule } from "../frameworks/base/BaseModule";

/**
 * @class ConnectGameSvr
 * @description 游戏服务器连接管理类，负责连接游戏服务器和加入私密房间，使用单例模式
 * @category 网络请求模块
 * @singleton 单例模式
 */
export class ConnectGameSvr extends BaseModule {
    static get instance(): ConnectGameSvr {
        return this._getInstance<ConnectGameSvr>(ConnectGameSvr);
    }

    /**
     * @description 连接到游戏服务器
     * @param data 连接数据（游戏ID、房间ID、服务器地址等）
     * @param callBack 回调函数
     */
    connectGame(data:{gameid:number, roomid:string, shortRoomid?:number, addr:string}, callBack?:(success:boolean, data?:any)=>void){
        DataCenter.instance.gameid = data.gameid;
        DataCenter.instance.roomid = data.roomid;
        DataCenter.instance.gameAddr = data.addr;
        DataCenter.instance.shortRoomid = data.shortRoomid ?? 0 // 匹配房
        console.log(LogColors.green('游戏房间准备完成'));
        const authCallBack = (success:boolean) => { 
            callBack && callBack(success);
        }
        AuthGame.instance.req(data.addr, data.gameid, data.roomid, authCallBack);
    }

    /**
     * @description 加入私密房间
     * @param roomid 短房间ID
     * @param callBack 回调函数
     */
    joinPrivateRoom(roomid:number, callBack?:(success:boolean, data?:any)=>void):void{
        const func = (result:any)=>{
            if(result && result.code == 1){
                result.shortRoomid = roomid;
                const func2 = (success:boolean) => {
                    callBack && callBack(success);
                }
                this.connectGame(result,func2)
            }else{
                callBack && callBack(false, result);
            }
        }

        this.reqLobby(SprotoJoinPrivateRoom,{shortRoomid:roomid}, func)
    }
}