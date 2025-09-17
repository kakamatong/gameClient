import { DataCenter } from "../../../datacenter/datacenter";
import FGUICompPrivateCreate from "../../../fgui/privateRoom/FGUICompPrivateCreate";
import * as fgui from "fairygui-cc";
import { LobbySocketManager } from "../../../frameworks/lobbySocketManager";

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
            playerCnt:2
        }
        const func = (result:any)=>{
            if(result && result.code == 1){
                DataCenter.instance.gameid = result.gameid;
                DataCenter.instance.roomid = result.roomid;
                DataCenter.instance.gameAddr = result.addr;
                DataCenter.instance.shortRoomid = result.shortRoomid;
                this._data && (this._data.connectToGame && this._data.connectToGame(result.addr, result.gameid, result.roomid))
            }
        }
        const reqData = {gameid:10001, rule:JSON.stringify(gameRule)}
        LobbySocketManager.instance.sendToServer('createPrivateRoom',reqData, func)
    }
}
fgui.UIObjectFactory.setExtension(CompPrivateCreate.URL, CompPrivateCreate);