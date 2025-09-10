
import FGUICompMatchAct from '../../../fgui/match/FGUICompMatchAct';
import * as fgui from "fairygui-cc";
import {getRandomInt} from '../../../frameworks/utils/utils'
import {Director} from 'cc'
export class CompMatchAct extends FGUICompMatchAct {
    private _ctrls:Array<fgui.Controller> = []
    private _nowIndex = 0;
    protected onConstruct(){
        super.onConstruct();
        const direct = Director.instance.getScheduler();
        direct.schedule(this.change.bind(this), this, 0.2)
        this._ctrls.push(this.ctrl_act_0)
        this._ctrls.push(this.ctrl_act_1)
        this._ctrls.push(this.ctrl_act_2)
    }

    change(){
        if (!this.node) {
            return
        }
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
        const newn = getRandomInt(0, tmp.length - 1)
        return tmp[newn];
    }

    protected onDestroy(): void {
        const direct = Director.instance.getScheduler();
        direct.unschedule(this.change.bind(this), this)
        super.onDestroy();
    }
}
fgui.UIObjectFactory.setExtension(CompMatchAct.URL, CompMatchAct);