/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUIBgActView from "./FGUIBgActView";
import FGUICompTop from "./FGUICompTop";

export default class FGUILobbyView extends fgui.GComponent {

	public UI_IMG_BG:fgui.GImage;
	public UI_COMP_BG_ACT:FGUIBgActView;
	public UI_BTN_MATCH_ROOM:fgui.GButton;
	public UI_BTN_PRIVATE_ROOM:fgui.GButton;
	public UI_COMP_TOP:FGUICompTop;
	public UI_BTN_MAILS:fgui.GButton;
	public UI_BTN_RANK:fgui.GButton;
	public static URL:string = "ui://gv22rev3sc722";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUILobbyView.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("lobby", "LobbyView") as FGUILobbyView;

			view.makeFullScreen();
			FGUILobbyView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUILobbyView.instance && FGUILobbyView.instance.dispose();
		FGUILobbyView.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUILobbyView {
		return <FGUILobbyView>(fgui.UIPackage.createObject("lobby", "LobbyView"));
	}

	protected onConstruct():void {
		this.UI_IMG_BG = <fgui.GImage>(this.getChildAt(0));
		this.UI_COMP_BG_ACT = <FGUIBgActView>(this.getChildAt(1));
		this.UI_BTN_MATCH_ROOM = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_MATCH_ROOM.onClick(this.onBtnMatchRoom, this);
		this.UI_BTN_PRIVATE_ROOM = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_PRIVATE_ROOM.onClick(this.onBtnPrivateRoom, this);
		this.UI_COMP_TOP = <FGUICompTop>(this.getChildAt(4));
		this.UI_BTN_MAILS = <fgui.GButton>(this.getChildAt(5));
		this.UI_BTN_MAILS.onClick(this.onBtnMails, this);
		this.UI_BTN_RANK = <fgui.GButton>(this.getChildAt(6));
		this.UI_BTN_RANK.onClick(this.onBtnRank, this);
	}
	onBtnMatchRoom():void{};
	onBtnPrivateRoom():void{};
	onBtnMails():void{};
	onBtnRank():void{};
}
fgui.UIObjectFactory.setExtension(FGUILobbyView.URL, FGUILobbyView);