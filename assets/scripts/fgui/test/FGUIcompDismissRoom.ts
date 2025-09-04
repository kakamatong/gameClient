/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUIcompDismissRoom extends fgui.GComponent {

	public ctrl_agree:fgui.Controller;
	public UI_LV_DISMISS:fgui.GList;
	public UI_BTN_DISMISS_AGREE:fgui.GButton;
	public UI_BTN_DISMISS_REFUSE:fgui.GButton;
	public UI_TXT_LEFT_TIME:fgui.GTextField;
	public UI_TXT_LEFT_TIME_2:fgui.GTextField;
	public static URL:string = "ui://ljshfpzynhct7";

	public static packageName:string = "test";

	public static createInstance():FGUIcompDismissRoom {
		return <FGUIcompDismissRoom>(fgui.UIPackage.createObject("test", "compDismissRoom"));
	}

	protected onConstruct():void {
		this.ctrl_agree = this.getControllerAt(0);
		this.UI_LV_DISMISS = <fgui.GList>(this.getChildAt(1));
		this.UI_BTN_DISMISS_AGREE = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_DISMISS_AGREE.onClick(this.onBtnDismissAgree, this);
		this.UI_BTN_DISMISS_REFUSE = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_DISMISS_REFUSE.onClick(this.onBtnDismissRefuse, this);
		this.UI_TXT_LEFT_TIME = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_LEFT_TIME_2 = <fgui.GTextField>(this.getChildAt(5));
	}
	onBtnDismissAgree():void{};
	onBtnDismissRefuse():void{};
}
fgui.UIObjectFactory.setExtension(FGUIcompDismissRoom.URL, FGUIcompDismissRoom);