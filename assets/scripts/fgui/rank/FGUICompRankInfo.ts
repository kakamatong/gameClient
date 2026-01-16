/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompRankInfo extends fgui.GComponent {

	public UI_TXT_RANK:fgui.GTextField;
	public UI_TXT_NAME:fgui.GTextField;
	public UI_TXT_SCORE:fgui.GTextField;
	public static URL:string = "ui://2a32uf5yis911";

	public static packageName:string = "rank";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompRankInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("rank", "CompRankInfo") as FGUICompRankInfo;

			view.makeFullScreen();
			FGUICompRankInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompRankInfo.instance = null;
	}
	public static hideView():void {
		FGUICompRankInfo.instance && FGUICompRankInfo.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompRankInfo {
		return <FGUICompRankInfo>(fgui.UIPackage.createObject("rank", "CompRankInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_RANK = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_NAME = <fgui.GTextField>(this.getChildAt(1));
		this.UI_TXT_SCORE = <fgui.GTextField>(this.getChildAt(2));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUICompRankInfo.URL, FGUICompRankInfo);