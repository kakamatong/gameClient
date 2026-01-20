import FGUIComProp from "../../../fgui/props/FGUIComProp";
import { ViewClass } from "../../../frameworks/Framework";
import * as fgui from "fairygui-cc";
import { PropInfo } from "../data/PropConfig";
import { Prop } from "../../../modules/Prop";

/**
 * 道具组件类
 */

@ViewClass()
export class ComProp extends FGUIComProp { 
    /**
     * 显示
     * @param info 
     */
    show(info:PropInfo):void{
        const data = Prop.create(info.id);
        this.UI_TXT_NUM.text = `x${info.num ?? 0}`
        this.UI_LOADER_ICON.url = data?.icon ?? "";
    }

}
fgui.UIObjectFactory.setExtension(ComProp.URL, ComProp);