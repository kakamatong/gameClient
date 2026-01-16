/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompOffline extends fgui.GComponent {

	public act:fgui.Transition;
	public static URL:string = "ui://2zsfe53xqaf2a";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompOffline.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001", "CompOffline") as FGUICompOffline;

			view.makeFullScreen();
			FGUICompOffline.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompOffline.instance = null;
	}
	public static hideView():void {
		FGUICompOffline.instance && FGUICompOffline.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompOffline {
		return <FGUICompOffline>(fgui.UIPackage.createObject("game10001", "CompOffline"));
	}

	protected onConstruct():void {
		this.act = this.getTransitionAt(0);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompOffline.URL, FGUICompOffline);