import FGUICompTalk from '../../../../../fgui/game10001/FGUICompTalk';
import * as fgui from "fairygui-cc";
export class CompTalk extends FGUICompTalk {
    private _localSeat:number = 0;
    private _talkMsg:string = "";
    private _txtNode:fgui.GTextField | null = null;

    public set talkMsg(value:string){
        this._talkMsg = value;
        this.visible = true;
        
        this.unscheduleAllCallbacks();
        this.scheduleOnce(()=>{
            this._txtNode && (this._txtNode.text = value);
        }, 2);

        this.scheduleOnce(()=>{
            this._talkMsg = ""
            this.visible = false;
        }, 0);
    }

    public get talkMsg():string{
        return this._talkMsg;
    }

    public set localSeat(value:number){
        if(!value) return;
        this._localSeat = value;
        const index = this.localSeatToIndex(value);
        this.ctrl_pos.selectedIndex = index;
        this._txtNode = this.getChild(`UI_TXT_${index}`) as fgui.GTextField;
    }

    public get localSeat():number{
        return this._localSeat;
    }

    localSeatToIndex(value:number):number{
        switch(value){
            case 1: return 0;
            case 2: return 2;
            case 3: return 1;
            default: return 0;
        }
    }
}
fgui.UIObjectFactory.setExtension(CompTalk.URL, CompTalk);