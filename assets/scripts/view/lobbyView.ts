import { _decorator} from 'cc';
import FGUILobbyView from '../fgui/lobby/FGUILobbyView';
import * as fgui from "fairygui-cc";
const { ccclass, property } = _decorator;

@ccclass('LobbyView')
export class LobbyView extends FGUILobbyView {

    private _node1: fgui.GObject | null = null;
    private _node2: fgui.GObject | null = null;
    private _node3: fgui.GObject | null = null;
    private _node4: fgui.GObject | null = null;

    // 继承出来的对象，必须重写
    public static showView(params?:any):void {
        fgui.UIObjectFactory.setExtension(LobbyView.URL, LobbyView);
        super.showView(params);
    }

    onEnable(){
        super.onEnable();
        this.initUI();
    }

    initUI(){ 
        this._node1 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_1
        this._node2 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_2
        this._node3 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_3
        this._node4 = this.UI_COMP_BG_ACT.UI_COMP_BG_ACT_4
    }

    onDisable(){
        super.onDisable();
    }

    onBtnTest(): void {
        fgui.GRoot.inst.showTooltips("123456")
    }

    runBgAct(): void {
        //this.UI_COMP_BG_ACT.runBgAct()
    }

    onUpdate():void{
        //console.log("1")
        if (!this._node1 || !this._node2 || !this._node3 || !this._node4) {
            return
        }
        this._node1.x = this._node1.x - 1
        this._node1.y = this._node1.y - 1

        this._node2.x = this._node2.x - 1
        this._node2.y = this._node2.y - 1

        this._node3.x = this._node3.x - 1
        this._node3.y = this._node3.y - 1

        this._node4.x = this._node4.x - 1
        this._node4.y = this._node4.y - 1

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

    onDestroy():void {

    }

}