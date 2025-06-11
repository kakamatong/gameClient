/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUITestView extends fgui.GComponent {

	public UI_BTN_LOGIN:fgui.GButton;
	public UI_BTN_CLOSE:fgui.GButton;
	public UI_BTN_CON:fgui.GButton;
	public UI_BTN_MATCH:fgui.GButton;
	public UI_INPUT_ACC:fgui.GTextInput;
	public UI_INPUT_PASS:fgui.GTextInput;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_USERID:fgui.GTextField;
	public UI_TXT_USER_STATUS:fgui.GTextField;
	public UI_BTN_SHOW:fgui.GButton;
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
		this.UI_BTN_CON = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_CON.onClick(this.onBtnCon, this);
		this.UI_BTN_MATCH = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_MATCH.onClick(this.onBtnMatch, this);
		this.UI_INPUT_ACC = <fgui.GTextInput>(this.getChildAt(4));
		this.UI_INPUT_PASS = <fgui.GTextInput>(this.getChildAt(5));
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(6));
		this.UI_TXT_USERID = <fgui.GTextField>(this.getChildAt(7));
		this.UI_TXT_USER_STATUS = <fgui.GTextField>(this.getChildAt(8));
		this.UI_BTN_SHOW = <fgui.GButton>(this.getChildAt(9));
		this.UI_BTN_SHOW.onClick(this.onBtnShow, this);
	}
	onBtnLogin():void{};
	onBtnClose():void{};
	onBtnCon():void{};
	onBtnMatch():void{};
	onBtnShow():void{};
}