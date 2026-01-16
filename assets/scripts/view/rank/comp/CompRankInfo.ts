import { _decorator} from 'cc';
import FGUICompRankInfo from "../../../fgui/rank/FGUICompRankInfo";
import * as fgui from "fairygui-cc";
import { ViewClass } from '../../../frameworks/Framework';

@ViewClass()
export class CompRankInfo extends FGUICompRankInfo { 
    show(data?:any){
        this.UI_TXT_NAME.text = data.nickname ?? "";
        this.UI_TXT_RANK.text = data.rank ?? "";
        this.UI_TXT_SCORE.text = data.score ?? "";
    }
}
fgui.UIObjectFactory.setExtension(CompRankInfo.URL, CompRankInfo);