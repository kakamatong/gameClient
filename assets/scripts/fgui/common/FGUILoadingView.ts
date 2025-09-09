/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUILoadingView extends fgui.GComponent {

	public title:fgui.GTextField;
	public static URL:string = "ui://gj0r6g5iis91o";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUILoadingView.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("common", "LoadingView") as FGUILoadingView;

			view.makeFullScreen();
			FGUILoadingView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUILoadingView.instance && FGUILoadingView.instance.dispose();
		FGUILoadingView.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUILoadingView {
		return <FGUILoadingView>(fgui.UIPackage.createObject("common", "LoadingView"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUILoadingView.URL, FGUILoadingView);