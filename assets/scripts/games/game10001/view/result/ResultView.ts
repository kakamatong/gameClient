import FGUIResultView from '../../../../fgui/game10001Result/FGUIResultView';
import * as fgui from "fairygui-cc";

export class ResultView extends FGUIResultView { 
    show(data?:any){
        this.ctrl_flag.selectedIndex = data?.flag ?? 0;
        this.act.play(()=>{
            this.UI_COMP_ACT.ctrl_show.selectedIndex = 1
        })
    }

    onBtnBack(): void {
        ResultView.hideView()
    }

    onBtnCon(): void {
        
    }
}
fgui.UIObjectFactory.setExtension(ResultView.URL, ResultView);