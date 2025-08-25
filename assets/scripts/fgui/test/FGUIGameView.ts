/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUIGameView extends fgui.GComponent {

	public ctrl_out:fgui.Controller;
	public UI_BTN_CLOSE:fgui.GButton;
	public UI_TXT_NICKNAME_2:fgui.GTextField;
	public UI_TXT_USERID_2:fgui.GTextField;
	public UI_TXT_STATUS_2:fgui.GTextField;
	public UI_TXT_NICKNAME_1:fgui.GTextField;
	public UI_TXT_STATUS_1:fgui.GTextField;
	public UI_TXT_USERID_1:fgui.GTextField;
	public UI_TXT_GAME_MSG:fgui.GTextField;
	public UI_TXT_GAME_STEP:fgui.GTextField;
	public UI_BTN_PAPER:fgui.GButton;
	public UI_BTN_ROCK:fgui.GButton;
	public UI_BTN_SCISSORS:fgui.GButton;
	public UI_TXT_OUT_HAND_1:fgui.GTextField;
	public UI_TXT_OUT_HAND_2:fgui.GTextField;
	public UI_BTN_SURE:fgui.GButton;
	public UI_BTN_CONTINUE:fgui.GButton;
	public UI_TXT_SHORT_ROOMID:fgui.GTextField;
	public UI_BTN_READY:fgui.GButton;
	public static URL:string = "ui://ljshfpzyu4cy3";

	public static packageName:string = "test";

	public static createInstance():FGUIGameView {
		return <FGUIGameView>(fgui.UIPackage.createObject("test", "GameView"));
	}

	protected onConstruct():void {
		this.ctrl_out = this.getControllerAt(0);
		this.UI_BTN_CLOSE = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_CLOSE.onClick(this.onBtnClose, this);
		this.UI_TXT_NICKNAME_2 = <fgui.GTextField>(this.getChildAt(3));
		this.UI_TXT_USERID_2 = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_STATUS_2 = <fgui.GTextField>(this.getChildAt(5));
		this.UI_TXT_NICKNAME_1 = <fgui.GTextField>(this.getChildAt(6));
		this.UI_TXT_STATUS_1 = <fgui.GTextField>(this.getChildAt(7));
		this.UI_TXT_USERID_1 = <fgui.GTextField>(this.getChildAt(8));
		this.UI_TXT_GAME_MSG = <fgui.GTextField>(this.getChildAt(9));
		this.UI_TXT_GAME_STEP = <fgui.GTextField>(this.getChildAt(10));
		this.UI_BTN_PAPER = <fgui.GButton>(this.getChildAt(11));
		this.UI_BTN_PAPER.onClick(this.onBtnPaper, this);
		this.UI_BTN_ROCK = <fgui.GButton>(this.getChildAt(12));
		this.UI_BTN_ROCK.onClick(this.onBtnRock, this);
		this.UI_BTN_SCISSORS = <fgui.GButton>(this.getChildAt(13));
		this.UI_BTN_SCISSORS.onClick(this.onBtnScissors, this);
		this.UI_TXT_OUT_HAND_1 = <fgui.GTextField>(this.getChildAt(14));
		this.UI_TXT_OUT_HAND_2 = <fgui.GTextField>(this.getChildAt(15));
		this.UI_BTN_SURE = <fgui.GButton>(this.getChildAt(16));
		this.UI_BTN_SURE.onClick(this.onBtnSure, this);
		this.UI_BTN_CONTINUE = <fgui.GButton>(this.getChildAt(17));
		this.UI_BTN_CONTINUE.onClick(this.onBtnContinue, this);
		this.UI_TXT_SHORT_ROOMID = <fgui.GTextField>(this.getChildAt(18));
		this.UI_BTN_READY = <fgui.GButton>(this.getChildAt(19));
		this.UI_BTN_READY.onClick(this.onBtnReady, this);
	}
	onBtnClose():void{};
	onBtnPaper():void{};
	onBtnRock():void{};
	onBtnScissors():void{};
	onBtnSure():void{};
	onBtnContinue():void{};
	onBtnReady():void{};
}