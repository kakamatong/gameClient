import { DataCenter } from "../../../datacenter/Datacenter";
import FGUICompPrivateCreate from "../../../fgui/privateRoom/FGUICompPrivateCreate";
import * as fgui from "fairygui-cc";
import { LobbySocketManager } from "../../../frameworks/LobbySocketManager";
import { PopMessageView } from "../../common/popMessageView";
import { ENUM_POP_MESSAGE_TYPE } from "../../../datacenter/InterfaceConfig";
import { TipsView } from "../../common/tipsView";

export class CompPrivateCreate extends FGUICompPrivateCreate { 
    private _data:any|null = null;
    show(data?:any){
        this._data = data;
    }

    onBtnClose(): void {
        CompPrivateCreate.hideView()
    }

    onBtnCreate(): void {
        const gameRule = {
            playerCnt:2,
            mode: this.ctrl_mode.selectedIndex
        }
        const func = (result:any)=>{
            if(result && result.code == 1){
                DataCenter.instance.gameid = result.gameid;
                DataCenter.instance.roomid = result.roomid;
                DataCenter.instance.gameAddr = result.addr;
                DataCenter.instance.shortRoomid = result.shortRoomid;
                this._data && (this._data.connectToGame && this._data.connectToGame(result.addr, result.gameid, result.roomid))
            }else if (result && result.code == 0 && result.gameid > 0) {
                PopMessageView.showView({
                    content:'您已在游戏中,是否返回',
                    type:ENUM_POP_MESSAGE_TYPE.NUM2,
                    sureBack:()=>{
                        DataCenter.instance.gameid = result.gameid;
                        DataCenter.instance.roomid = result.roomid;
                        DataCenter.instance.gameAddr = result.addr;
                        DataCenter.instance.shortRoomid = result.shortRoomid;
                        this._data && (this._data.connectToGame && this._data.connectToGame(result.addr, result.gameid, result.roomid))
                    }
                })
            }else{
                const msg = result && result.msg ? result.msg : '未知错误';
                TipsView.showView({content:msg})
            }
        }
        const reqData = {gameid:10001, rule:JSON.stringify(gameRule)}
        LobbySocketManager.instance.sendToServer('createPrivateRoom',reqData, func)
    }
}
fgui.UIObjectFactory.setExtension(CompPrivateCreate.URL, CompPrivateCreate);