/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUITestView extends fgui.GComponent {

	public UI_BTN_LOGIN:fgui.GButton;
	public UI_BTN_CLOSE:fgui.GButton;
	public static URL:string = "ui://ljshfpzyb2zj0";

	public static packageName:string = "test";

	public static createInstance():FGUITestView {
		return <FGUITestView>(fgui.UIPackage.createObject("test", "TestView"));
	}

	protected onConstruct():void {
		this.UI_BTN_LOGIN = <fgui.GButton>(this.getChildAt(0));
		this.UI_BTN_LOGIN.onClick(this.onBtnLogin, this);
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
	}
	private onBtnLogin():void{};
	private onBtnClose():void{};
}