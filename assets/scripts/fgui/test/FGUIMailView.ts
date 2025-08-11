/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUIMailView extends fgui.GComponent {

	public UI_BTN_CLOSE:fgui.GButton;
	public UI_LV_MAILS:fgui.GList;
	public static URL:string = "ui://ljshfpzyeatn5";

	public static packageName:string = "test";

	public static createInstance():FGUIMailView {
		return <FGUIMailView>(fgui.UIPackage.createObject("test", "MailView"));
	}

	protected onConstruct():void {
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(0));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.UI_LV_MAILS = <fgui.GList>(this.getChildAt(1));
	}
	onBtnClose():void{};
}