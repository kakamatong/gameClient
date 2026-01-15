/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompTips extends fgui.GComponent {

	public title:fgui.GTextField;
	public static URL:string = "ui://gj0r6g5iddz1k";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompTips.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("common", "CompTips") as FGUICompTips;

			view.makeFullScreen();
			FGUICompTips.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompTips.instance = null;
	}
	public static hideView():void {
		FGUICompTips.instance && FGUICompTips.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompTips {
		return <FGUICompTips>(fgui.UIPackage.createObject("common", "CompTips"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompTips.URL, FGUICompTips);