import FGUILoadingView from "../../fgui/common/FGUILoadingView";
import * as fgui from "fairygui-cc";

export class LoadingView extends FGUILoadingView { 
    show(data?:any){
        this.title.text = data.content ?? "加载中";
    }
}
fgui.UIObjectFactory.setExtension(LoadingView.URL, LoadingView);