/**
 * @file CompRankInfo.ts
 * @description 排行榜信息组件：显示单个排名信息
 * @category 排行榜视图
 */

import { _decorator} from 'cc';
import FGUICompRankInfo from "../../../fgui/rank/FGUICompRankInfo";
import * as fgui from "fairygui-cc";
import { ViewClass } from '../../../frameworks/Framework';

/**
 * @class CompRankInfo
 * @description 排行榜信息组件，显示单个排名信息
 * @category 排行榜视图
 */
@ViewClass()
export class CompRankInfo extends FGUICompRankInfo {
    /**
     * @description 显示排名信息
     * @param data 排名数据
     */
    show(data?:any){
        this.UI_TXT_NAME.text = data.nickname ?? "";
        this.UI_TXT_RANK.text = data.rank ?? "";
        this.UI_TXT_SCORE.text = data.score ?? "";
    }
}
fgui.UIObjectFactory.setExtension(CompRankInfo.URL, CompRankInfo);