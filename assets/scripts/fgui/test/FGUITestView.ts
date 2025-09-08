/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
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
	public UI_BTN_TEST1:fgui.GButton;
	public UI_BTN_TEST2:fgui.GButton;
	public UI_BTN_MATCH_TEST_1:fgui.GButton;
	public UI_BTN_MATCH_TEST_2:fgui.GButton;
	public UI_BTN_GET_RANK:fgui.GButton;
	public UI_BTN_GET_RANK_SELF:fgui.GButton;
	public UI_LV_RANKLIST:fgui.GList;
	public UI_BTN_MAIL:fgui.GButton;
	public UI_TXT_RICH_1:fgui.GTextField;
	public UI_TXT_RICH_2:fgui.GTextField;
	public UI_BTN_CREATE:fgui.GButton;
	public UI_BTN_JOIN:fgui.GButton;
	public UI_INPUT_SHORT_ROOM_ID:fgui.GTextInput;
	public UI_TXT_SHORT_ROOM_ID:fgui.GTextField;
	public static URL:string = "ui://ljshfpzyb2zj0";

	public static packageName:string = "test";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUITestView.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("test", "TestView") as FGUITestView;

			view.makeFullScreen();
			FGUITestView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUITestView.instance && FGUITestView.instance.dispose();
		FGUITestView.instance = null;
	}
	show(data?:any):void{};
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
		this.UI_BTN_TEST1 = <fgui.GButton>(this.getChildAt(10));
		this.UI_BTN_TEST1.onClick(this.onBtnTest1, this);
		this.UI_BTN_TEST2 = <fgui.GButton>(this.getChildAt(11));
		this.UI_BTN_TEST2.onClick(this.onBtnTest2, this);
		this.UI_BTN_MATCH_TEST_1 = <fgui.GButton>(this.getChildAt(12));
		this.UI_BTN_MATCH_TEST_1.onClick(this.onBtnMatchTest1, this);
		this.UI_BTN_MATCH_TEST_2 = <fgui.GButton>(this.getChildAt(13));
		this.UI_BTN_MATCH_TEST_2.onClick(this.onBtnMatchTest2, this);
		this.UI_BTN_GET_RANK = <fgui.GButton>(this.getChildAt(14));
		this.UI_BTN_GET_RANK.onClick(this.onBtnGetRank, this);
		this.UI_BTN_GET_RANK_SELF = <fgui.GButton>(this.getChildAt(15));
		this.UI_BTN_GET_RANK_SELF.onClick(this.onBtnGetRankSelf, this);
		this.UI_LV_RANKLIST = <fgui.GList>(this.getChildAt(16));
		this.UI_BTN_MAIL = <fgui.GButton>(this.getChildAt(17));
		this.UI_BTN_MAIL.onClick(this.onBtnMail, this);
		this.UI_TXT_RICH_1 = <fgui.GTextField>(this.getChildAt(18));
		this.UI_TXT_RICH_2 = <fgui.GTextField>(this.getChildAt(19));
		this.UI_BTN_CREATE = <fgui.GButton>(this.getChildAt(20));
		this.UI_BTN_CREATE.onClick(this.onBtnCreate, this);
		this.UI_BTN_JOIN = <fgui.GButton>(this.getChildAt(21));
		this.UI_BTN_JOIN.onClick(this.onBtnJoin, this);
		this.UI_INPUT_SHORT_ROOM_ID = <fgui.GTextInput>(this.getChildAt(22));
		this.UI_TXT_SHORT_ROOM_ID = <fgui.GTextField>(this.getChildAt(23));
	}
	onBtnLogin():void{};
	onBtnClose():void{};
	onBtnCon():void{};
	onBtnMatch():void{};
	onBtnShow():void{};
	onBtnTest1():void{};
	onBtnTest2():void{};
	onBtnMatchTest1():void{};
	onBtnMatchTest2():void{};
	onBtnGetRank():void{};
	onBtnGetRankSelf():void{};
	onBtnMail():void{};
	onBtnCreate():void{};
	onBtnJoin():void{};
}
fgui.UIObjectFactory.setExtension(FGUITestView.URL, FGUITestView);