import FGUICompBg from "../../../fgui/lobby/FGUICompBg";
import { ViewClass } from "../../../frameworks/Framework";
import * as fgui from "fairygui-cc";

/**
 * 背景动画组件
 */
@ViewClass()
export class CompBg extends FGUICompBg {
    private _node1: fgui.GObject | null = null;
    private _node2: fgui.GObject | null = null;
    private _node3: fgui.GObject | null = null;
    private _node4: fgui.GObject | null = null;

    onConstruct(): void {
        super.onConstruct()
        this.initUI()
    }

    initUI(): void {
        this._node1 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_1
        this._node2 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_2
        this._node3 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_3
        this._node4 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_4
    }

    /**
     * 计时器回调
     * @returns 
     */
    onUpdate():void{
        if (!this._node1 || !this._node2 || !this._node3 || !this._node4) {
            return
        }
        const d = 0.5
        this._node1.x = this._node1.x - d
        this._node1.y = this._node1.y - d

        this._node2.x = this._node2.x - d
        this._node2.y = this._node2.y - d

        this._node3.x = this._node3.x - d
        this._node3.y = this._node3.y - d

        this._node4.x = this._node4.x - d
        this._node4.y = this._node4.y - d

        if (this._node1.x < -1530) {
            this._node1.x = 210
            this._node1.y = 902
        }

        if (this._node2.x < -1530) {
            this._node2.x = 210
            this._node2.y = 902
        }

        if (this._node3.x < -1530) {
            this._node3.x = 210
            this._node3.y = 902
        }

        if (this._node4.x < -1530) {
            this._node4.x = 210
            this._node4.y = 902
        }
    }
}
fgui.UIObjectFactory.setExtension(CompBg.URL, CompBg);