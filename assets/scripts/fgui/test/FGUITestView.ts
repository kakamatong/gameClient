/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUITestView extends fgui.GComponent {

	public UI_BTN_LOGIN:fgui.GButton;
	public UI_BTN_CLOSE:fgui.GButton;
	public UI_BTN_CON:fgui.GButton;
	public UI_BTN_MATCH:fgui.GButton;
	public UI_BTN_ENTER_GAME:fgui.GButton;
	public UI_INPUT_ACC:fgui.GTextInput;
	public UI_INPUT_PASS:fgui.GTextInput;
	public UI_BTN_READY:fgui.GButton;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_USERID:fgui.GTextField;
	public UI_TXT_USER_STATUS:fgui.GTextField;
	public UI_TXT_PLAYER_STATUS_0:fgui.GTextField;
	public UI_TXT_PLAYER_STATUS_1:fgui.GTextField;
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
		this.UI_BTN_ENTER_GAME = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_ENTER_GAME.onClick(this.onBtnEnterGame, this);
		this.UI_INPUT_ACC = <fgui.GTextInput>(this.getChildAt(5));
		this.UI_INPUT_PASS = <fgui.GTextInput>(this.getChildAt(6));
		this.UI_BTN_READY = <fgui.GButton>(this.getChildAt(7));
		this.UI_BTN_READY.onClick(this.onBtnReady, this);
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(8));
		this.UI_TXT_USERID = <fgui.GTextField>(this.getChildAt(9));
		this.UI_TXT_USER_STATUS = <fgui.GTextField>(this.getChildAt(10));
		this.UI_TXT_PLAYER_STATUS_0 = <fgui.GTextField>(this.getChildAt(11));
		this.UI_TXT_PLAYER_STATUS_1 = <fgui.GTextField>(this.getChildAt(12));
	}
	onBtnLogin():void{};
	onBtnClose():void{};
	onBtnCon():void{};
	onBtnMatch():void{};
	onBtnEnterGame():void{};
	onBtnReady():void{};
}