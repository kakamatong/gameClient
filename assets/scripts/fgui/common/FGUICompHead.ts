/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompHead extends fgui.GComponent {

	public UI_LOADER_HEAD:fgui.GLoader;
	public static URL:string = "ui://gj0r6g5icvev9";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompHead.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("common", "CompHead") as FGUICompHead;

			view.makeFullScreen();
			FGUICompHead.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompHead.instance = null;
	}
	public static hideView():void {
		FGUICompHead.instance && FGUICompHead.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompHead {
		return <FGUICompHead>(fgui.UIPackage.createObject("common", "CompHead"));
	}

	protected onConstruct():void {
		this.UI_LOADER_HEAD = <fgui.GLoader>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompHead.URL, FGUICompHead);