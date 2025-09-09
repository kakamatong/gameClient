import { _decorator} from 'cc';
import FGUICompRankInfo from "../../../fgui/rank/FGUICompRankInfo";
import * as fgui from "fairygui-cc";

export class CompRankInfo extends FGUICompRankInfo { 
    show(data?:any){
        this.UI_TXT_NAME.text = data.name ?? "";
        this.UI_TXT_RANK.text = data.rank ?? "";
        this.UI_TXT_SCORE.text = data.score ?? "";
    }
}
fgui.UIObjectFactory.setExtension(CompRankInfo.URL, CompRankInfo);