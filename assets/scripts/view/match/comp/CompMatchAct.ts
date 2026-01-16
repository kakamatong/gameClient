
import FGUICompMatchAct from '../../../fgui/match/FGUICompMatchAct';
import * as fgui from "fairygui-cc";
import {GetRandomInt} from '../../../frameworks/utils/Utils'
import { ViewClass } from '../../../frameworks/Framework';

@ViewClass()
export class CompMatchAct extends FGUICompMatchAct {
    private _ctrls:Array<fgui.Controller> = []
    private _nowIndex = 0;
    private _scheid:(()=>void) | null = null;
    protected onConstruct(){
        super.onConstruct();
        this._scheid = this.change.bind(this)
        this.schedule(this._scheid, 0.2)
        this._ctrls.push(this.ctrl_act_0)
        this._ctrls.push(this.ctrl_act_1)
        this._ctrls.push(this.ctrl_act_2)
    }

    change(){
        const nowCtrl = this._ctrls[this._nowIndex]
        nowCtrl.selectedIndex = this.random(nowCtrl.selectedIndex)
        this._nowIndex++;
        this._nowIndex = this._nowIndex % this._ctrls.length
    }

    random(n:number):number{
        const tmp:number[] = []
        for (let index = 0; index < this._ctrls.length; index++) {
            if (index != n) {
                tmp.push(index)
            }
        }
        const newn = GetRandomInt(0, tmp.length - 1)
        return tmp[newn];
    }

    stopSche():void{ 
        this._scheid && this.unschedule(this._scheid)
    }

    success():void{ 
        const n = GetRandomInt(0, this._ctrls.length - 1)
        this.ctrl_act_0.selectedIndex = n
        this.ctrl_act_1.selectedIndex = n
        this.ctrl_act_2.selectedIndex = n
    }

}
fgui.UIObjectFactory.setExtension(CompMatchAct.URL, CompMatchAct);