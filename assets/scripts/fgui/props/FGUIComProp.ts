/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIComProp extends fgui.GComponent {

	public ctrl_num:fgui.Controller;
	public UI_LOADER_ICON:fgui.GLoader;
	public UI_TXT_NUM:fgui.GTextField;
	public static URL:string = "ui://fwundh2cpz9v1b";

	public static packageName:string = "props";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIComProp.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("props", "ComProp") as FGUIComProp;

			view.makeFullScreen();
			FGUIComProp.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIComProp.instance = null;
	}
	public static hideView():void {
		FGUIComProp.instance && FGUIComProp.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIComProp {
		return <FGUIComProp>(fgui.UIPackage.createObject("props", "ComProp"));
	}

	protected onConstruct():void {
		this.ctrl_num = this.getControllerAt(0);
		this.UI_LOADER_ICON = <fgui.GLoader>(this.getChildAt(1));
		this.UI_TXT_NUM = <fgui.GTextField>(this.getChildAt(2));
	}
	scheduleOnce(callback: () => void, delay: number):void{};
	unscheduleAllCallbacks():void{};
	unschedule(callback: () => void):void{};
	schedule(callback: () => void, interval: number):void{};
}
fgui.UIObjectFactory.setExtension(FGUIComProp.URL, FGUIComProp);