/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompTop from "./FGUICompTop";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompLobbyMain extends fgui.GComponent {

	public UI_BTN_MATCH_ROOM:fgui.GButton;
	public UI_BTN_PRIVATE_ROOM:fgui.GButton;
	public UI_COMP_TOP:FGUICompTop;
	public UI_BTN_MAILS:fgui.GButton;
	public UI_BTN_RANK:fgui.GButton;
	public UI_TXT_ENV:fgui.GTextField;
	public UI_BTN_SHARE:fgui.GButton;
	public UI_BTN_SIGN_IN:fgui.GButton;
	public UI_BTN_AD:fgui.GButton;
	public static URL:string = "ui://gv22rev3ln74i";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompLobbyMain.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("lobby", "CompLobbyMain") as FGUICompLobbyMain;

			view.makeFullScreen();
			FGUICompLobbyMain.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompLobbyMain.instance = null;
	}
	public static hideView():void {
		FGUICompLobbyMain.instance && FGUICompLobbyMain.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompLobbyMain {
		return <FGUICompLobbyMain>(fgui.UIPackage.createObject("lobby", "CompLobbyMain"));
	}

	protected onConstruct():void {
		this.UI_BTN_MATCH_ROOM = <fgui.GButton>(this.getChildAt(0));
		this.UI_BTN_MATCH_ROOM.onClick(this.onBtnMatchRoom, this);
		this.UI_BTN_PRIVATE_ROOM = <fgui.GButton>(this.getChildAt(1));
		this.UI_BTN_PRIVATE_ROOM.onClick(this.onBtnPrivateRoom, this);
		this.UI_COMP_TOP = <FGUICompTop>(this.getChildAt(2));
		this.UI_BTN_MAILS = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_MAILS.onClick(this.onBtnMails, this);
		this.UI_BTN_RANK = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_RANK.onClick(this.onBtnRank, this);
		this.UI_TXT_ENV = <fgui.GTextField>(this.getChildAt(5));
		this.UI_BTN_SHARE = <fgui.GButton>(this.getChildAt(6));
		this.UI_BTN_SHARE.onClick(this.onBtnShare, this);
		this.UI_BTN_SIGN_IN = <fgui.GButton>(this.getChildAt(7));
		this.UI_BTN_SIGN_IN.onClick(this.onBtnSignIn, this);
		this.UI_BTN_AD = <fgui.GButton>(this.getChildAt(8));
		this.UI_BTN_AD.onClick(this.onBtnAd, this);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
	onBtnMatchRoom():void{};
	onBtnPrivateRoom():void{};
	onBtnMails():void{};
	onBtnRank():void{};
	onBtnShare():void{};
	onBtnSignIn():void{};
	onBtnAd():void{};
}
fgui.UIObjectFactory.setExtension(FGUICompLobbyMain.URL, FGUICompLobbyMain);