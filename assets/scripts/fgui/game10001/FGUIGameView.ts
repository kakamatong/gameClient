/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompOffline from "./FGUICompOffline";
import FGUICompThinkAct from "./FGUICompThinkAct";
import FGUICompHand from "./FGUICompHand";
import FGUIBtnSelect from "./FGUIBtnSelect";
import FGUICompClock from "./FGUICompClock";
import FGUICompGameStartAct from "./FGUICompGameStartAct";
import FGUICompRoundAct from "./FGUICompRoundAct";

export default class FGUIGameView extends fgui.GComponent {

	public ctrl_select:fgui.Controller;
	public ctrl_btn:fgui.Controller;
	public ctrl_roomtype:fgui.Controller;
	public UI_BTN_DISBAND:fgui.GButton;
	public UI_BTN_BACK:fgui.GButton;
	public UI_COMP_HEAD_2:fgui.GComponent;
	public UI_TXT_WINLOSE_2:fgui.GTextField;
	public UI_TXT_NICKNAME_2:fgui.GTextField;
	public UI_TXT_ID_2:fgui.GTextField;
	public UI_COMP_OFFLINE:FGUICompOffline;
	public UI_COMP_THINKING:FGUICompThinkAct;
	public UI_GROUP_PLAYER_2:fgui.GGroup;
	public UI_COMP_HEAD_1:fgui.GComponent;
	public UI_TXT_NICKNAME_1:fgui.GTextField;
	public UI_TXT_ID_1:fgui.GTextField;
	public UI_TXT_WINLOSE_1:fgui.GTextField;
	public UI_GROUP_PLAYER_1:fgui.GGroup;
	public UI_COMP_OUT_HEND_1:FGUICompHand;
	public UI_IMG_SIGN_READY_2:fgui.GImage;
	public UI_IMG_SIGN_READY_1:fgui.GImage;
	public UI_COMP_OUT_HEND_2:FGUICompHand;
	public UI_BTN_SURE:fgui.GButton;
	public UI_BTN_CHANGE:fgui.GButton;
	public UI_BTN_CONTINUE:fgui.GButton;
	public UI_BTN_READY:fgui.GButton;
	public UI_BTN_PAPER:FGUIBtnSelect;
	public UI_BTN_ROCK:FGUIBtnSelect;
	public UI_BTN_SCISSORS:FGUIBtnSelect;
	public UI_GROUP_SELECT:fgui.GGroup;
	public UI_COMP_CLOCK:FGUICompClock;
	public UI_COMP_GAME_START:FGUICompGameStartAct;
	public UI_TXT_ROOMID:fgui.GTextField;
	public UI_TXT_RULE:fgui.GTextField;
	public UI_TXT_PROGRESS:fgui.GTextField;
	public UI_COMP_ROUND_ACT:FGUICompRoundAct;
	public static URL:string = "ui://2zsfe53xis911";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIGameView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001", "GameView") as FGUIGameView;

			view.makeFullScreen();
			FGUIGameView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIGameView.instance = null;
	}
	public static hideView():void {
		FGUIGameView.instance && FGUIGameView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIGameView {
		return <FGUIGameView>(fgui.UIPackage.createObject("game10001", "GameView"));
	}

	protected onConstruct():void {
		this.ctrl_select = this.getControllerAt(0);
		this.ctrl_btn = this.getControllerAt(1);
		this.ctrl_roomtype = this.getControllerAt(2);
		this.UI_BTN_DISBAND = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_DISBAND.onClick(this.onBtnDisband, this);
		this.UI_BTN_BACK = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_BACK.onClick(this.onBtnBack, this);
		this.UI_COMP_HEAD_2 = <fgui.GComponent>(this.getChildAt(4));
		this.UI_TXT_WINLOSE_2 = <fgui.GTextField>(this.getChildAt(5));
		this.UI_TXT_NICKNAME_2 = <fgui.GTextField>(this.getChildAt(6));
		this.UI_TXT_ID_2 = <fgui.GTextField>(this.getChildAt(7));
		this.UI_COMP_OFFLINE = <FGUICompOffline>(this.getChildAt(8));
		this.UI_COMP_THINKING = <FGUICompThinkAct>(this.getChildAt(9));
		this.UI_GROUP_PLAYER_2 = <fgui.GGroup>(this.getChildAt(10));
		this.UI_COMP_HEAD_1 = <fgui.GComponent>(this.getChildAt(12));
		this.UI_TXT_NICKNAME_1 = <fgui.GTextField>(this.getChildAt(13));
		this.UI_TXT_ID_1 = <fgui.GTextField>(this.getChildAt(14));
		this.UI_TXT_WINLOSE_1 = <fgui.GTextField>(this.getChildAt(15));
		this.UI_GROUP_PLAYER_1 = <fgui.GGroup>(this.getChildAt(16));
		this.UI_COMP_OUT_HEND_1 = <FGUICompHand>(this.getChildAt(17));
		this.UI_IMG_SIGN_READY_2 = <fgui.GImage>(this.getChildAt(18));
		this.UI_IMG_SIGN_READY_1 = <fgui.GImage>(this.getChildAt(19));
		this.UI_COMP_OUT_HEND_2 = <FGUICompHand>(this.getChildAt(20));
		this.UI_BTN_SURE = <fgui.GButton>(this.getChildAt(21));
		this.UI_BTN_SURE.onClick(this.onBtnSure, this);
		this.UI_BTN_CHANGE = <fgui.GButton>(this.getChildAt(22));
		this.UI_BTN_CHANGE.onClick(this.onBtnChange, this);
		this.UI_BTN_CONTINUE = <fgui.GButton>(this.getChildAt(23));
		this.UI_BTN_CONTINUE.onClick(this.onBtnContinue, this);
		this.UI_BTN_READY = <fgui.GButton>(this.getChildAt(24));
		this.UI_BTN_READY.onClick(this.onBtnReady, this);
		this.UI_BTN_PAPER = <FGUIBtnSelect>(this.getChildAt(26));
		this.UI_BTN_PAPER.onClick(this.onBtnPaper, this);
		this.UI_BTN_ROCK = <FGUIBtnSelect>(this.getChildAt(27));
		this.UI_BTN_ROCK.onClick(this.onBtnRock, this);
		this.UI_BTN_SCISSORS = <FGUIBtnSelect>(this.getChildAt(28));
		this.UI_BTN_SCISSORS.onClick(this.onBtnScissors, this);
		this.UI_GROUP_SELECT = <fgui.GGroup>(this.getChildAt(29));
		this.UI_COMP_CLOCK = <FGUICompClock>(this.getChildAt(30));
		this.UI_COMP_GAME_START = <FGUICompGameStartAct>(this.getChildAt(31));
		this.UI_TXT_ROOMID = <fgui.GTextField>(this.getChildAt(33));
		this.UI_TXT_RULE = <fgui.GTextField>(this.getChildAt(34));
		this.UI_TXT_PROGRESS = <fgui.GTextField>(this.getChildAt(35));
		this.UI_COMP_ROUND_ACT = <FGUICompRoundAct>(this.getChildAt(39));
	}
	onBtnDisband():void{};
	onBtnBack():void{};
	onBtnSure():void{};
	onBtnChange():void{};
	onBtnContinue():void{};
	onBtnReady():void{};
	onBtnPaper():void{};
	onBtnRock():void{};
	onBtnScissors():void{};
}
fgui.UIObjectFactory.setExtension(FGUIGameView.URL, FGUIGameView);