/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUILoadingView extends fgui.GComponent {

	public title:fgui.GTextField;
	public act:fgui.Transition;
	public static URL:string = "ui://gj0r6g5iis91o";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUILoadingView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("common", "LoadingView") as FGUILoadingView;

			view.makeFullScreen();
			FGUILoadingView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUILoadingView.instance = null;
	}
	public static hideView():void {
		FGUILoadingView.instance && FGUILoadingView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUILoadingView {
		return <FGUILoadingView>(fgui.UIPackage.createObject("common", "LoadingView"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChildAt(1));
		this.act = this.getTransitionAt(0);
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUILoadingView.URL, FGUILoadingView);