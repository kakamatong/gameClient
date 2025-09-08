/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";
import FGUICompPopMessage from "./FGUICompPopMessage";

export default class FGUIPopMessageView extends fgui.GComponent {

	public mask:fgui.GGraph;
	public UI_COMP_MAIN:FGUICompPopMessage;
	public static URL:string = "ui://gj0r6g5imuz3i";

	public static packageName:string = "common";

	public static instance:any | null = null;

	public static showView(params?:any):void {
		if(FGUIPopMessageView.instance) {
			console.log("allready show");
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = fgui.UIPackage.createObject("common", "PopMessageView") as FGUIPopMessageView;

			view.makeFullScreen();
			FGUIPopMessageView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static hideView():void {
		FGUIPopMessageView.instance && FGUIPopMessageView.instance.dispose();
		FGUIPopMessageView.instance = null;
	}

	show(data?:any):void{};

	public static createInstance():FGUIPopMessageView {
		return <FGUIPopMessageView>(fgui.UIPackage.createObject("common", "PopMessageView"));
	}

	protected onConstruct():void {
		this.mask = <fgui.GGraph>(this.getChildAt(0));
		this.UI_COMP_MAIN = <FGUICompPopMessage>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUIPopMessageView.URL, FGUIPopMessageView);