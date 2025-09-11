/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIBtnSelect extends fgui.GButton {

	public mask:fgui.GLoader;
	public static URL:string = "ui://2zsfe53xqaf2f";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIBtnSelect.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001", "BtnSelect") as FGUIBtnSelect;

			view.makeFullScreen();
			FGUIBtnSelect.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	public static hideView():void {
		FGUIBtnSelect.instance && FGUIBtnSelect.instance.dispose();
		FGUIBtnSelect.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUIBtnSelect {
		return <FGUIBtnSelect>(fgui.UIPackage.createObject("game10001", "BtnSelect"));
	}

	protected onConstruct():void {
		this.mask = <fgui.GLoader>(this.getChildAt(0));
	}
}
fgui.UIObjectFactory.setExtension(FGUIBtnSelect.URL, FGUIBtnSelect);