/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUIGameView extends fgui.GComponent {

	public UI_BTN_CLOSE:fgui.GButton;
	public UI_TXT_NICKNAME_2:fgui.GTextField;
	public UI_TXT_USERID_2:fgui.GTextField;
	public UI_TXT_NICKNAME_1:fgui.GTextField;
	public UI_TXT_USERID_1:fgui.GTextField;
	public UI_TXT_GAME_MSG:fgui.GTextField;
	public static URL:string = "ui://ljshfpzyu4cy3";

	public static packageName:string = "test";

	public static createInstance():FGUIGameView {
		return <FGUIGameView>(fgui.UIPackage.createObject("test", "GameView"));
	}

	protected onConstruct():void {
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.UI_TXT_NICKNAME_2 = <fgui.GTextField>(this.getChildAt(3));
		this.UI_TXT_USERID_2 = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_NICKNAME_1 = <fgui.GTextField>(this.getChildAt(5));
		this.UI_TXT_USERID_1 = <fgui.GTextField>(this.getChildAt(6));
		this.UI_TXT_GAME_MSG = <fgui.GTextField>(this.getChildAt(7));
	}
	onBtnClose():void{};
}