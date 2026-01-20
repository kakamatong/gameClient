import FGUICompAwardMain from "../../../fgui/award/FGUICompAwardMain";
import { ViewClass } from "../../../frameworks/Framework";
import * as fgui from "fairygui-cc";
import { AwardConfig } from "../data/AwardConfig";
import { ComProp } from "../../props/comp/ComProp";
import { AwardNotices } from "../../../modules/AwardNotices";

@ViewClass()
export class CompAwardMain extends FGUICompAwardMain { 
    private _data:AwardConfig | null = null;
    /**
     * 显示
     * @param args 
     */
    show(args:AwardConfig):void{
        this._data = args;
        
        // 通知服务消费通知
        if (this._data.noticeid && this._data.noticeid >= 0) {
            const notice = new AwardNotices();
            notice.reqRead(this._data?.noticeid || 0)
        }
        this.initUI();
    }

    /**
     * 初始化UI
     */
    initUI():void{
        this.UI_LIST_AWARD.itemRenderer = this.itemRenderer.bind(this);
        this.UI_LIST_AWARD.numItems = this._data?.ids.length || 0;
    }

    /**
     * 列表渲染
     * @param index 
     * @param obj 
     */
    itemRenderer(index:number, obj:fgui.GObject):void{
        const id = this._data?.ids[index] ?? 0
        const num = this._data?.nums[index] ??0
        const node = obj as ComProp
        node.show({id, num})
    }
}
fgui.UIObjectFactory.setExtension(CompAwardMain.URL, CompAwardMain);