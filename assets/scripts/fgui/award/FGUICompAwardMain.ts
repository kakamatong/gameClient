/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompAwardMain extends fgui.GComponent {

	public UI_LIST_AWARD:fgui.GList;
	public static URL:string = "ui://vb2pxowopizs3";

	public static packageName:string = "award";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompAwardMain.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("award", "CompAwardMain") as FGUICompAwardMain;

			view.makeFullScreen();
			FGUICompAwardMain.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompAwardMain.instance = null;
	}
	public static hideView():void {
		FGUICompAwardMain.instance && FGUICompAwardMain.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompAwardMain {
		return <FGUICompAwardMain>(fgui.UIPackage.createObject("award", "CompAwardMain"));
	}

	protected onConstruct():void {
		this.UI_LIST_AWARD = <fgui.GList>(this.getChildAt(2));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompAwardMain.URL, FGUICompAwardMain);