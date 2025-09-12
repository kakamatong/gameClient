
import FGUICompClock from '../../../../fgui/game10001/FGUICompClock';
import * as fgui from "fairygui-cc";
export class CompClock extends FGUICompClock {

    private _scheid:((dt:number)=>void) | null = null;
    private _clock:number = 0;
    protected onConstruct(){
        super.onConstruct();
        const comp = this.node.components[0]
        this._scheid = this.tick.bind(this)
        comp.schedule(this._scheid, 1)
    }

    tick(dt: number){
        if (this._clock > 0) {
            this._clock--;
            this.title.text = this._clock.toString().padStart(2, '0')
        }
    }

    start(clock:number):void{
        this._clock = clock;
        this.title.text = this._clock.toString().padStart(2, '0')
    }
}
fgui.UIObjectFactory.setExtension(CompClock.URL, CompClock);