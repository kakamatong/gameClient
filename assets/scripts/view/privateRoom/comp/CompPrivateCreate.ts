import FGUICompPrivateCreate from "../../../fgui/privateRoom/FGUICompPrivateCreate";
import * as fgui from "fairygui-cc";
import { LobbySocketManager } from "../../../frameworks/LobbySocketManager";
import { PopMessageView } from "../../common/PopMessageView";
import { CREATE_ROOM_PLAYER_CNT, ENUM_POP_MESSAGE_TYPE, LOCAL_KEY } from "../../../datacenter/InterfaceConfig";
import { TipsView } from "../../common/TipsView";
import { sys } from "cc";
import { ConnectGameSvr } from "../../../modules/ConnectGameSvr";
import { ViewClass } from "../../../frameworks/Framework";

@ViewClass()
export class CompPrivateCreate extends FGUICompPrivateCreate { 
    private _data:any|null = null;
    show(data?:any){
        this._data = data;
        const strRule = sys.localStorage.getItem(LOCAL_KEY.PRIVATE_RULE)
        if (strRule && strRule !== '') {
            this.initUI(JSON.parse(strRule))
        }
    }

    initUI(rule:any):void{
        this.ctrl_mode.selectedIndex = rule.mode;
        this.ctrl_cnt.selectedIndex = CREATE_ROOM_PLAYER_CNT.indexOf(rule.playerCnt);
    }

    onBtnClose(): void {
        CompPrivateCreate.hideView()
    }

    onBtnCreate(): void {
        const gameRule = {
            playerCnt:CREATE_ROOM_PLAYER_CNT[this.ctrl_cnt.selectedIndex],
            mode: this.ctrl_mode.selectedIndex
        }
        const func = (result:any)=>{
            if(result && result.code == 1){
                ConnectGameSvr.instance.connectGame(result,(b:boolean)=>{
                    if (b) {
                        this._data && (this._data.changeToGameScene && this._data.changeToGameScene())
                    }
                })
            }else if (result && result.code == 0 && result.gameid > 0) {
                PopMessageView.showView({
                    content:'您已在游戏中,是否返回',
                    type:ENUM_POP_MESSAGE_TYPE.NUM2,
                    sureBack:()=>{
                        ConnectGameSvr.instance.connectGame(result,(b:boolean)=>{
                            if (b) {
                                this._data && (this._data.changeToGameScene && this._data.changeToGameScene())
                            }
                        })
                    }
                })
            }else{
                const msg = result && result.msg ? result.msg : '未知错误';
                TipsView.showView({content:msg})
            }
        }

        const strRule = JSON.stringify(gameRule)
        sys.localStorage.setItem(LOCAL_KEY.PRIVATE_RULE, strRule)
        const reqData = {gameid:10001, rule:strRule}
        LobbySocketManager.instance.sendToServer('createPrivateRoom',reqData, func)
    }
}
fgui.UIObjectFactory.setExtension(CompPrivateCreate.URL, CompPrivateCreate);