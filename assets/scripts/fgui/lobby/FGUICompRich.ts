/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompRich extends fgui.GComponent {

	public UI_TXT_NUM:fgui.GTextField;
	public UI_LOADER_ICON:fgui.GLoader;
	public static URL:string = "ui://gv22rev3ok17e";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompRich.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("lobby", "CompRich") as FGUICompRich;

			view.makeFullScreen();
			FGUICompRich.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompRich.instance = null;
	}
	public static hideView():void {
		FGUICompRich.instance && FGUICompRich.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompRich {
		return <FGUICompRich>(fgui.UIPackage.createObject("lobby", "CompRich"));
	}

	protected onConstruct():void {
		this.UI_TXT_NUM = <fgui.GTextField>(this.getChildAt(1));
		this.UI_LOADER_ICON = <fgui.GLoader>(this.getChildAt(2));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompRich.URL, FGUICompRich);