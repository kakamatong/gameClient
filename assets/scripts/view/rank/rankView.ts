import { _decorator} from 'cc';
import FGUIRankView from "../../fgui/rank/FGUIRankView";
import { CompRankInfo } from "./comp/compRankInfo";
import * as fgui from "fairygui-cc";

export class RankView extends FGUIRankView { 
    private _data:any | null = null;
    show(data?:any){
        this.UI_LV_RANK.itemRenderer = this.itemRenderer.bind(this)
        if (data) {
            this._data = data;
            this.UI_LV_RANK.numItems = data.length;
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