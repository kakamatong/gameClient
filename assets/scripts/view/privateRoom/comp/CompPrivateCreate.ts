/**
 * @file CompPrivateCreate.ts
 * @description 创建私密房间组件：处理私密房间的创建
 * @category 私密房间视图
 */

import FGUICompPrivateCreate from "../../../fgui/privateRoom/FGUICompPrivateCreate";
import * as fgui from "fairygui-cc";
import { LobbySocketManager } from "../../../frameworks/LobbySocketManager";
import { PopMessageView } from "../../common/PopMessageView";
import { CREATE_ROOM_PLAYER_CNT, ENUM_POP_MESSAGE_TYPE, LOCAL_KEY } from "../../../datacenter/InterfaceConfig";
import { TipsView } from "../../common/TipsView";
import { sys } from "cc";
import { ConnectGameSvr } from "../../../modules/ConnectGameSvr";
import { ViewClass } from "../../../frameworks/Framework";
import { SprotoCreatePrivateRoom } from "db://assets/types/protocol/lobby/c2s";

/**
 * @class CompPrivateCreate
 * @description 创建私密房间组件，处理私密房间的创建
 * @category 私密房间视图
 */
@ViewClass()
export class CompPrivateCreate extends FGUICompPrivateCreate {
    /** 视图数据 */
    private _data:any|null = null;

    /**
     * @description 显示创建私密房间界面
     * @param data 视图数据
     */
    show(data?:any){
        this._data = data;
        const strRule = sys.localStorage.getItem(LOCAL_KEY.PRIVATE_RULE)
        if (strRule && strRule !== '') {
            this.initUI(JSON.parse(strRule))
        }
    }

    /**
     * @description 初始化UI
     * @param rule 房间规则
     */
    initUI(rule:any):void{
        this.ctrl_mode.selectedIndex = rule.mode;
        this.ctrl_cnt.selectedIndex = CREATE_ROOM_PLAYER_CNT.indexOf(rule.playerCnt);
    }

    /**
     * @description 关闭按钮点击事件
     */
    onBtnClose(): void {
        CompPrivateCreate.hideView()
    }

    /**
     * @description 创建房间按钮点击事件
     */
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
        LobbySocketManager.instance.sendToServer(SprotoCreatePrivateRoom,reqData, func)
    }
}
fgui.UIObjectFactory.setExtension(CompPrivateCreate.URL, CompPrivateCreate);