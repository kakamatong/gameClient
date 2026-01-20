/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUIBgActView from "./FGUIBgActView";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompBg extends fgui.GComponent {

	public UI_IMG_BG:fgui.GImage;
	public UI_COMP_BG_ACT:FGUIBgActView;
	public static URL:string = "ui://gv22rev3wgijh";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompBg.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("lobby", "CompBg") as FGUICompBg;

			view.makeFullScreen();
			FGUICompBg.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompBg.instance = null;
	}
	public static hideView():void {
		FGUICompBg.instance && FGUICompBg.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompBg {
		return <FGUICompBg>(fgui.UIPackage.createObject("lobby", "CompBg"));
	}

	protected onConstruct():void {
		this.UI_IMG_BG = <fgui.GImage>(this.getChildAt(0));
		this.UI_COMP_BG_ACT = <FGUIBgActView>(this.getChildAt(1));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompBg.URL, FGUICompBg);