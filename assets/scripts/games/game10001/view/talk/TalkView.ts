import FGUICompItem from "db://assets/scripts/fgui/game10001Talk/FGUICompItem";
import FGUITalkView from "db://assets/scripts/fgui/game10001Talk/FGUITalkView";
import { ViewClass } from "db://assets/scripts/frameworks/Framework";
import { GameSocketManager } from "db://assets/scripts/frameworks/GameSocketManager";
import { TALK_LIST } from "db://assets/scripts/games/game10001/view/talk/TalkConfig";
import { SprotoForwardMessage } from "db://assets/types/protocol/game10001/c2s";
import * as fgui from "fairygui-cc";
import { FORWARD_MESSAGE_TYPE } from "../../data/InterfaceGameConfig";

@ViewClass()
export class TalkView extends FGUITalkView { 

    show(data?:any){
        this.initUI();
    }

    initUI(){
        this.UI_COMP_MAIN.UI_LIST_TALK.itemRenderer = this.itemRenderer.bind(this);
    }

    itemRenderer(index:number, obj:fgui.GObject){
        const data = TALK_LIST[index];
        const node = obj as FGUICompItem
        node.UI_TXT_TALK.text = data.msg;
        node.UI_TXT_SPEED.text = `x${data.speed}`;

        node.onClick(()=>{
            this.sendTalk(data.id);
        }, this);
    }

    sendTalk(id:number){
        const data = {
            id: id
        }
        GameSocketManager.instance.sendToServer(SprotoForwardMessage, {type:FORWARD_MESSAGE_TYPE.TALK, msg:JSON.stringify(data)});
    }
}

fgui.UIObjectFactory.setExtension(TalkView.URL, TalkView);