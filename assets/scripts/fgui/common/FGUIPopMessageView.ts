/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompPopMessage from "./FGUICompPopMessage";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIPopMessageView extends fgui.GComponent {

	public UI_COMP_MAIN:FGUICompPopMessage;
	public static URL:string = "ui://gj0r6g5imuz3i";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIPopMessageView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("common", "PopMessageView") as FGUIPopMessageView;

			view.makeFullScreen();
			FGUIPopMessageView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIPopMessageView.instance = null;
	}
	public static hideView():void {
		FGUIPopMessageView.instance && FGUIPopMessageView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIPopMessageView {
		return <FGUIPopMessageView>(fgui.UIPackage.createObject("common", "PopMessageView"));
	}

	protected onConstruct():void {
		this.UI_COMP_MAIN = <FGUICompPopMessage>(this.getChildAt(1));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUIPopMessageView.URL, FGUIPopMessageView);