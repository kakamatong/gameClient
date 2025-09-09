import { _decorator} from 'cc';
import FGUIRankView from "../../fgui/rank/FGUIRankView";
import { CompRankInfo } from "./comp/compRankInfo";
import * as fgui from "fairygui-cc";

export class RankView extends FGUIRankView { 
    private _data:any | null = null;
    private _selfRank:number = 0;
    show(data?:any){
        this.UI_LV_RANK.itemRenderer = this.itemRenderer.bind(this)
        if (data) {
            this._data = JSON.parse(data.rankList);
            this.UI_LV_RANK.numItems = this._data.length;
            this._selfRank = data.rank ?? 999999;
            this.UI_TXT_SELF_RANK.text = `${this._selfRank == 999999 ? '未上榜' : this._selfRank}`
        }
    }

    itemRenderer(index:number, item:fgui.GObject){ 
        const itemData = this._data[index];
        itemData.rank = `${index + 1}`;
        (item as CompRankInfo).show(itemData);
    }

    onBtnClose(): void {
        RankView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(RankView.URL, RankView);