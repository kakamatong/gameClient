/**
 * @file LoadingView.ts
 * @description 加载视图：显示加载中的界面
 * @category 通用视图
 */

import FGUILoadingView from "../../fgui/common/FGUILoadingView";
import * as fgui from "fairygui-cc";
import { ViewClass } from "../../frameworks/Framework";

/**
 * @class LoadingView
 * @description 加载视图，显示加载进度提示
 * @category 通用视图
 */
@ViewClass()
export class LoadingView extends FGUILoadingView {
    /** 定时器回调函数 */
    private _scheid:(()=>void) | null = null;
    /**
     * @description 显示加载视图
     * @param data 加载数据配置
     */
    show(data?:any){
        this.title.text = data.content ?? "加载中";
        if (data.time && data.time > 0) {
            this._scheid = this.onTimeEnd.bind(this)
            this.schedule(this._scheid, data.time)
        }
    }

    /**
     * @description 定时结束处理
     */
    onTimeEnd():void{
        LoadingView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(LoadingView.URL, LoadingView);