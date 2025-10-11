import FGUITotalResultView from '../../../../fgui/game10001Result/FGUITotalResultView';
import * as fgui from "fairygui-cc";

export class TotalResultView extends FGUITotalResultView { 
    show(data?:any){
        this.UI_LV_INFO.itemRenderer = this.itemRenderer.bind(this)
    }

    itemRenderer(index:number, item:fgui.GObject){

    }

    onBtnBack(): void {
        TotalResultView.hideView()
    }

    onBtnExit(): void {
    }

}
fgui.UIObjectFactory.setExtension(TotalResultView.URL, TotalResultView);