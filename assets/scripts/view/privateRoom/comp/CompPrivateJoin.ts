import FGUICompPrivateJoin from "../../../fgui/privateRoom/FGUICompPrivateJoin";
import * as fgui from "fairygui-cc";
import { PopMessageView } from "../../common/PopMessageView";
import { ENUM_POP_MESSAGE_TYPE } from "../../../datacenter/InterfaceConfig";
import { TipsView } from "../../common/TipsView";
import { ConnectGameSvr } from "../../../modules/ConnectGameSvr";

export class CompPrivateJoin extends FGUICompPrivateJoin { 
    private _data:any|null = null;
    show(data?:any){
        this._data = data;
    }

    onBtnClose(): void {
        CompPrivateJoin.hideView()
    }

    onBtnJoin(): void {
        if (this.UI_TXT_ROOMID.text == "") {
            TipsView.showView({content:"请输入房间号"})
            return
        }
        const roomid = Number(this.UI_TXT_ROOMID.text);
        const func = (b:boolean, result:any)=>{
            if (b) {
                this._data && (this._data.changeToGameScene && this._data.changeToGameScene())
            }else if (!b && result && result.code == 0 && result.gameid > 0) {
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
            }else if(!b){
                const msg = result && result.msg ? result.msg : '未知错误';
                TipsView.showView({content:msg})
            }
        }

        ConnectGameSvr.instance.joinPrivateRoom(roomid, func)
    }

    onBtnJoin0(): void {
        this.input(0);
    }

    onBtnJoin1(): void {
        this.input(1);
    }

    onBtnJoin2(): void {
        this.input(2);
    }

    onBtnJoin3(): void {
        this.input(3);
    }

    onBtnJoin4(): void {
        this.input(4);
    }

    onBtnJoin5(): void {
        this.input(5);
    }

    onBtnJoin6(): void {
        this.input(6);
    }

    onBtnJoin7(): void {
        this.input(7);
    }

    onBtnJoin8(): void {
        this.input(8);
    }

    onBtnJoin9(): void {
        this.input(9);
    }

    input(n:number):void{
        if (this.UI_TXT_ROOMID.text?.length && this.UI_TXT_ROOMID.text?.length >= 6) {
            return 
        }

        this.UI_TXT_ROOMID.text = (this.UI_TXT_ROOMID.text ?? '') + `${n}`;
        if (this.UI_TXT_ROOMID.text.length === 6) {
            this.onBtnJoin()
        }
    }

    onBtnJoinClear(): void {
        this.UI_TXT_ROOMID.text = ''
    }

}
fgui.UIObjectFactory.setExtension(CompPrivateJoin.URL, CompPrivateJoin);