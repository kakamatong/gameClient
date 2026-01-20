/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompAwardMain from "./FGUICompAwardMain";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIAwardView extends fgui.GComponent {

	public UI_BG:fgui.GGraph;
	public UI_COMP_MAIN:FGUICompAwardMain;
	public enter:fgui.Transition;
	public static URL:string = "ui://vb2pxowopz9v0";

	public static packageName:string = "award";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIAwardView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("award", "AwardView") as FGUIAwardView;

			view.makeFullScreen();
			FGUIAwardView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIAwardView.instance = null;
	}
	public static hideView():void {
		FGUIAwardView.instance && FGUIAwardView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIAwardView {
		return <FGUIAwardView>(fgui.UIPackage.createObject("award", "AwardView"));
	}

	protected onConstruct():void {
		this.UI_BG = <fgui.GGraph>(this.getChildAt(0));
		this.UI_COMP_MAIN = <FGUICompAwardMain>(this.getChildAt(1));
		this.enter = this.getTransitionAt(0);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUIAwardView.URL, FGUIAwardView);