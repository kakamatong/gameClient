import { ScheduleOnce, UnscheduleAllCallbacks } from 'db://assets/scripts/frameworks/Framework';
import FGUICompTalk from '../../../../../fgui/game10001/FGUICompTalk';
import * as fgui from "fairygui-cc";
export class CompTalk extends FGUICompTalk {
    private _localSeat:number = 0;
    private _talkMsg:string = "";
    private _txtNode:fgui.GTextField | null = null;

    public set talkMsg(value:string){
        this._talkMsg = value;
        this._txtNode && (this._txtNode.text = value);
        this.visible = true;
        UnscheduleAllCallbacks(this.node.components[0]);
        ScheduleOnce(this.node.components[0], ()=>{
            this._talkMsg = ""
            this.visible = false;
        }, 2);
    }

    public get talkMsg():string{
        return this._talkMsg;
    }

    protected onConstruct(){
        super.onConstruct();
    }

    public set localSeat(value:number){
        this._localSeat = value;
        this._txtNode = this.getChild(`UI_TXT_${value}`) as fgui.GTextField;
    }

    public get localSeat():number{
        return this._localSeat;
    }
}
fgui.UIObjectFactory.setExtension(CompTalk.URL, CompTalk);