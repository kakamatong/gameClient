/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUIBgActView extends fgui.GComponent {

	public UI_COMP_BG_ACT_1:fgui.GComponent;
	public UI_COMP_BG_ACT_2:fgui.GComponent;
	public UI_COMP_BG_ACT_3:fgui.GComponent;
	public UI_COMP_BG_ACT_4:fgui.GComponent;
	public static URL:string = "ui://gv22rev3xoqi5";

	public static packageName:string = "lobby";

	public static createInstance():FGUIBgActView {
		return <FGUIBgActView>(fgui.UIPackage.createObject("lobby", "BgActView"));
	}

	protected onConstruct():void {
		this.UI_COMP_BG_ACT_1 = <fgui.GComponent>(this.getChildAt(0));
		this.UI_COMP_BG_ACT_2 = <fgui.GComponent>(this.getChildAt(1));
		this.UI_COMP_BG_ACT_3 = <fgui.GComponent>(this.getChildAt(2));
		this.UI_COMP_BG_ACT_4 = <fgui.GComponent>(this.getChildAt(3));
	}
}