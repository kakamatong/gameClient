import { DataCenter } from "../datacenter/Datacenter";
import { ENUM_CHANNEL_ID, LOGIN_TYPE } from "../datacenter/InterfaceConfig";
import { LogColors } from "../frameworks/Framework";
import { LobbySocketManager } from "../frameworks/LobbySocketManager";
import { ACCOUNT_INFO, Login } from "../frameworks/login/Login";
import { MiniGameUtils } from "../frameworks/utils/sdk/MiniGameUtils";
import { HttpPostWithDefaultJWT } from "../frameworks/utils/Utils";
import { Auth } from "./Auth";
import { AuthGame } from "./AuthGame";
import { AuthList } from "./AuthList";
import { sys } from 'cc';
export class ConnectGameSvr { 
    private static _instance: ConnectGameSvr;

    public static get instance(): ConnectGameSvr {
        if (!this._instance) {
            this._instance = new ConnectGameSvr();
        }
        return this._instance;
    }

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

        LobbySocketManager.instance.sendToServer('joinPrivateRoom',{shortRoomid:roomid}, func)
    }
}