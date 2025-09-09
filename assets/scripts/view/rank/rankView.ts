import { _decorator} from 'cc';
import FGUIRankView from "../../fgui/rank/FGUIRankView";
import * as fgui from "fairygui-cc";

export class RankView extends FGUIRankView { 
    show(data?:any){
        
    }
}
fgui.UIObjectFactory.setExtension(RankView.URL, RankView);