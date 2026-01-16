
import { ViewClass } from 'db://assets/scripts/frameworks/Framework';
import FGUICompClock from '../../../../../fgui/game10001/FGUICompClock';
import * as fgui from "fairygui-cc";

@ViewClass()
export class CompClock extends FGUICompClock {
    private _scheid:(()=>void) | null = null;
    private _isRunAct:boolean = false;
    private _clock:number = 0;
    protected onConstruct(){
        super.onConstruct();
        this._scheid = this.tick.bind(this)
    }

    tick(){
        if (this._clock < 5) {
            if (!this._isRunAct) {
                this._isRunAct = true;
                this.act.play(null, -1);
            }
        }
        if (this._clock > 0) {
            this.title.text = this._clock.toString().padStart(2, '0')
            this._clock--;
        }
    }

    start(clock:number):void{
        this._clock = clock;
        this.act.stop()
        this._isRunAct = false;
        this.tick()
    }

    protected onEnable(): void {
        super.onEnable();
        this._scheid && this.schedule(this._scheid, 1)
    }

    protected onDisable(): void {
        super.onDisable();
        this._scheid && this.unschedule(this._scheid)
    }
}
fgui.UIObjectFactory.setExtension(CompClock.URL, CompClock);