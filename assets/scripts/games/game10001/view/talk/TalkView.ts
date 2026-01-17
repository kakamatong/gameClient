import FGUICompItem from "db://assets/scripts/fgui/game10001Talk/FGUICompItem";
import FGUITalkView from "db://assets/scripts/fgui/game10001Talk/FGUITalkView";
import { PackageLoad, ViewClass } from "db://assets/scripts/frameworks/Framework";
import { GameSocketManager } from "db://assets/scripts/frameworks/GameSocketManager";
import { TALK_LIST } from "db://assets/scripts/games/game10001/view/talk/TalkConfig";
import {  SprotoTalkUse } from "db://assets/types/protocol/game10001/c2s";
import * as fgui from "fairygui-cc";
import { DataCenter } from "db://assets/scripts/datacenter/Datacenter";
import { RICH_TYPE } from "db://assets/scripts/datacenter/InterfaceConfig";
import { TipsView } from "db://assets/scripts/view/common/TipsView";

@PackageLoad(['props'])
@ViewClass()
export class TalkView extends FGUITalkView { 

    show(data?:any){
        this.initUI();
    }

    initUI(){
        this.UI_COMP_MAIN.UI_LIST_TALK.itemRenderer = this.itemRenderer.bind(this);
        this.UI_COMP_MAIN.UI_LIST_TALK.numItems = TALK_LIST.length;
        this.onClick(this.onBtnClose, this);
    }

    itemRenderer(index:number, obj:fgui.GObject){
        const data = TALK_LIST[index];
        const node = obj as FGUICompItem
        node.UI_TXT_TALK.text = data.msg;
        node.UI_TXT_SPEED.text = `x${data.speed}`;

        node.onClick(()=>{
            const rich = DataCenter.instance.getRichByType(RICH_TYPE.SILVER_COIN)
            if (!rich || rich.richNums < data.speed) {
                TipsView.showView({content:`银子不足(每日签到可补充银子)`})
                return 
            }
            this.sendTalk(data.id);
        }, this);
    }

    /**
     * 发送聊天
     * @param id 聊天id
     * @returns void
     */
    sendTalk(id:number){
        GameSocketManager.instance.sendToServer(SprotoTalkUse, { id: id }, (data :SprotoTalkUse.Response) => {
            if (data.code) {
                DataCenter.instance.updateRichByType(RICH_TYPE.SILVER_COIN, data.richNum)
            }
        });
    }

    /**
     * 关闭聊天
     * @returns void
     */
    onBtnClose(){
        if(this.in.playing){
            return
        }

        if(this.out.playing){
            return
        }

        this.out.play(() => {
            TalkView.hideView();
        });
    }
}

fgui.UIObjectFactory.setExtension(TalkView.URL, TalkView);