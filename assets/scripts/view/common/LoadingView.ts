import FGUILoadingView from "../../fgui/common/FGUILoadingView";
import * as fgui from "fairygui-cc";

export class LoadingView extends FGUILoadingView { 
    private _scheid:(()=>void) | null = null;
    show(data?:any){
        this.title.text = data.content ?? "加载中";
        if (data.time && data.time > 0) {
            this._scheid = this.onTimeEnd.bind(this)
            this.schedule(this._scheid, data.time)
        }
    }

    onTimeEnd():void{
        LoadingView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(LoadingView.URL, LoadingView);