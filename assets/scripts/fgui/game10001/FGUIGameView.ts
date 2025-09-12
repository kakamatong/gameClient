/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompOffline from "./FGUICompOffline";
import FGUICompThinkAct from "./FGUICompThinkAct";
import FGUICompHand from "./FGUICompHand";
import FGUIBtnSelect from "./FGUIBtnSelect";
import FGUICompClock from "./FGUICompClock";
import FGUICompGameStartAct from "./FGUICompGameStartAct";

export default class FGUIGameView extends fgui.GComponent {

	public ctrl_select:fgui.Controller;
	public ctrl_btn:fgui.Controller;
	public UI_BTN_BACK:fgui.GButton;
	public UI_TXT_NICKNAME_2:fgui.GTextField;
	public UI_TXT_ID_2:fgui.GTextField;
	public UI_COMP_OFFLINE:FGUICompOffline;
	public UI_COMP_THINKING:FGUICompThinkAct;
	public UI_IMG_SIGN_READY_2:fgui.GImage;
	public UI_GROUP_PLAYER_2:fgui.GGroup;
	public UI_TXT_NICKNAME_1:fgui.GTextField;
	public UI_TXT_ID_1:fgui.GTextField;
	public UI_IMG_SIGN_READY_1:fgui.GImage;
	public UI_GROUP_PLAYER_1:fgui.GGroup;
	public UI_COMP_OUT_HEAD_1:FGUICompHand;
	public UI_COMP_OUT_HEAD_2:FGUICompHand;
	public UI_BTN_SURE:fgui.GButton;
	public UI_BTN_CHANGE:fgui.GButton;
	public UI_BTN_PAPER:FGUIBtnSelect;
	public UI_BTN_ROCK:FGUIBtnSelect;
	public UI_BTN_SCISSORS:FGUIBtnSelect;
	public UI_GROUP_SELECT:fgui.GGroup;
	public UI_COMP_CLOCK:FGUICompClock;
	public UI_COMP_GAME_START:FGUICompGameStartAct;
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
		this.UI_BTN_BACK = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_BACK.onClick(this.onBtnBack, this);
		this.UI_TXT_NICKNAME_2 = <fgui.GTextField>(this.getChildAt(4));
		this.UI_TXT_ID_2 = <fgui.GTextField>(this.getChildAt(5));
		this.UI_COMP_OFFLINE = <FGUICompOffline>(this.getChildAt(6));
		this.UI_COMP_THINKING = <FGUICompThinkAct>(this.getChildAt(7));
		this.UI_IMG_SIGN_READY_2 = <fgui.GImage>(this.getChildAt(8));
		this.UI_GROUP_PLAYER_2 = <fgui.GGroup>(this.getChildAt(9));
		this.UI_TXT_NICKNAME_1 = <fgui.GTextField>(this.getChildAt(12));
		this.UI_TXT_ID_1 = <fgui.GTextField>(this.getChildAt(13));
		this.UI_IMG_SIGN_READY_1 = <fgui.GImage>(this.getChildAt(14));
		this.UI_GROUP_PLAYER_1 = <fgui.GGroup>(this.getChildAt(15));
		this.UI_COMP_OUT_HEAD_1 = <FGUICompHand>(this.getChildAt(16));
		this.UI_COMP_OUT_HEAD_2 = <FGUICompHand>(this.getChildAt(17));
		this.UI_BTN_SURE = <fgui.GButton>(this.getChildAt(18));
		this.UI_BTN_SURE.onClick(this.onBtnSure, this);
		this.UI_BTN_CHANGE = <fgui.GButton>(this.getChildAt(19));
		this.UI_BTN_CHANGE.onClick(this.onBtnChange, this);
		this.UI_BTN_PAPER = <FGUIBtnSelect>(this.getChildAt(21));
		this.UI_BTN_PAPER.onClick(this.onBtnPaper, this);
		this.UI_BTN_ROCK = <FGUIBtnSelect>(this.getChildAt(22));
		this.UI_BTN_ROCK.onClick(this.onBtnRock, this);
		this.UI_BTN_SCISSORS = <FGUIBtnSelect>(this.getChildAt(23));
		this.UI_BTN_SCISSORS.onClick(this.onBtnScissors, this);
		this.UI_GROUP_SELECT = <fgui.GGroup>(this.getChildAt(24));
		this.UI_COMP_CLOCK = <FGUICompClock>(this.getChildAt(25));
		this.UI_COMP_GAME_START = <FGUICompGameStartAct>(this.getChildAt(26));
	}
	onBtnBack():void{};
	onBtnSure():void{};
	onBtnChange():void{};
	onBtnPaper():void{};
	onBtnRock():void{};
	onBtnScissors():void{};
}
fgui.UIObjectFactory.setExtension(FGUIGameView.URL, FGUIGameView);