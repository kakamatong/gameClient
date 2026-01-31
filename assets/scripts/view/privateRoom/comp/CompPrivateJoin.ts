/**
 * @file CompPrivateJoin.ts
 * @description 加入私密房间组件：处理私密房间的加入
 * @category 私密房间视图
 */

import FGUICompPrivateJoin from "../../../fgui/privateRoom/FGUICompPrivateJoin";
import * as fgui from "fairygui-cc";
import { PopMessageView } from "../../common/PopMessageView";
import { ENUM_POP_MESSAGE_TYPE } from "../../../datacenter/InterfaceConfig";
import { TipsView } from "../../common/TipsView";
import { ConnectGameSvr } from "../../../modules/ConnectGameSvr";
import { ViewClass } from "../../../frameworks/Framework";

/**
 * @class CompPrivateJoin
 * @description 加入私密房间组件，处理私密房间的加入
 * @category 私密房间视图
 */
@ViewClass()
export class CompPrivateJoin extends FGUICompPrivateJoin {
    /** 视图数据 */
    private _data:any|null = null;

    /**
     * @description 显示加入私密房间界面
     * @param data 视图数据
     */
    show(data?:any){
        this._data = data;
    }

    /**
     * @description 关闭按钮点击事件
     */
    onBtnClose(): void {
        CompPrivateJoin.hideView()
    }

    /**
     * @description 加入房间按钮点击事件
     */
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

    /**
     * @description 数字0按钮点击事件
     */
    onBtnJoin0(): void {
        this.input(0);
    }

    /**
     * @description 数字1按钮点击事件
     */
    onBtnJoin1(): void {
        this.input(1);
    }

    /**
     * @description 数字2按钮点击事件
     */
    onBtnJoin2(): void {
        this.input(2);
    }

    /**
     * @description 数字3按钮点击事件
     */
    onBtnJoin3(): void {
        this.input(3);
    }

    /**
     * @description 数字4按钮点击事件
     */
    onBtnJoin4(): void {
        this.input(4);
    }

    /**
     * @description 数字5按钮点击事件
     */
    onBtnJoin5(): void {
        this.input(5);
    }

    /**
     * @description 数字6按钮点击事件
     */
    onBtnJoin6(): void {
        this.input(6);
    }

    /**
     * @description 数字7按钮点击事件
     */
    onBtnJoin7(): void {
        this.input(7);
    }

    /**
     * @description 数字8按钮点击事件
     */
    onBtnJoin8(): void {
        this.input(8);
    }

    /**
     * @description 数字9按钮点击事件
     */
    onBtnJoin9(): void {
        this.input(9);
    }

    /**
     * @description 输入数字到房间号
     * @param n 数字
     */
    input(n:number):void{
        if (this.UI_TXT_ROOMID.text?.length && this.UI_TXT_ROOMID.text?.length >= 6) {
            return
        }

        this.UI_TXT_ROOMID.text = (this.UI_TXT_ROOMID.text ?? '') + `${n}`;
        if (this.UI_TXT_ROOMID.text.length === 6) {
            this.onBtnJoin()
        }
    }

    /**
     * @description 清除房间号按钮点击事件
     */
    onBtnJoinClear(): void {
        this.UI_TXT_ROOMID.text = ''
    }

}
fgui.UIObjectFactory.setExtension(CompPrivateJoin.URL, CompPrivateJoin);