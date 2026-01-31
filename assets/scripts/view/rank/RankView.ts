/**
 * @file RankView.ts
 * @description 排行榜视图：显示游戏排行榜
 * @category 排行榜视图
 */

import FGUIRankView from "../../fgui/rank/FGUIRankView";
import { CompRankInfo } from "./comp/CompRankInfo";
import * as fgui from "fairygui-cc";
import { ViewClass } from '../../frameworks/Framework';

/**
 * @class RankView
 * @description 排行榜视图，显示游戏排行榜
 * @category 排行榜视图
 */
@ViewClass()
export class RankView extends FGUIRankView {
    /** 排行榜数据 */
    private _data:any | null = null;
    /** 当前用户排名 */
    private _selfRank:number = 0;

    /**
     * @description 显示排行榜视图
     * @param data 排行榜数据
     */
    show(data?:any){
        this.UI_LV_RANK.itemRenderer = this.itemRenderer.bind(this)
        if (data) {
            this._data = JSON.parse(data.rankList);
            this.UI_LV_RANK.numItems = this._data.length;
            this._selfRank = data.rank ?? 999999;
            this.UI_TXT_SELF_RANK.text = `${this._selfRank == 999999 ? '未上榜' : this._selfRank + 1}`
        }
    }

    /**
     * @description 列表项渲染函数
     * @param index 列表索引
     * @param item 列表项对象
     */
    itemRenderer(index:number, item:fgui.GObject){
        const itemData = this._data[index];
        itemData.rank = `${index + 1}`;
        (item as CompRankInfo).show(itemData);
    }

    /**
     * @description 关闭按钮点击事件
     */
    onBtnClose(): void {
        RankView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(RankView.URL, RankView);