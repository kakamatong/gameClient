/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompBg from "./FGUICompBg";
import FGUICompLobbyMain from "./FGUICompLobbyMain";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUILobbyView extends fgui.GComponent {

	public bg:FGUICompBg;
	public UI_COMP_MAIN:FGUICompLobbyMain;
	public static URL:string = "ui://gv22rev3sc722";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUILobbyView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("lobby", "LobbyView") as FGUILobbyView;

			view.makeFullScreen();
			FGUILobbyView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUILobbyView.instance = null;
	}
	public static hideView():void {
		FGUILobbyView.instance && FGUILobbyView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUILobbyView {
		return <FGUILobbyView>(fgui.UIPackage.createObject("lobby", "LobbyView"));
	}

	protected onConstruct():void {
		this.bg = <FGUICompBg>(this.getChildAt(0));
		this.UI_COMP_MAIN = <FGUICompLobbyMain>(this.getChildAt(1));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUILobbyView.URL, FGUILobbyView);