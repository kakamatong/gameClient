/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUITotalResultView extends fgui.GComponent {

	public UI_LV_INFO:fgui.GList;
	public UI_BTN_EXIT:fgui.GButton;
	public UI_BTN_BACK:fgui.GButton;
	public static URL:string = "ui://5x18e99vkv65p";

	public static packageName:string = "game10001Result";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUITotalResultView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001Result", "TotalResultView") as FGUITotalResultView;

			view.makeFullScreen();
			FGUITotalResultView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUITotalResultView.instance = null;
	}
	public static hideView():void {
		FGUITotalResultView.instance && FGUITotalResultView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUITotalResultView {
		return <FGUITotalResultView>(fgui.UIPackage.createObject("game10001Result", "TotalResultView"));
	}

	protected onConstruct():void {
		this.UI_LV_INFO = <fgui.GList>(this.getChildAt(3));
		this.UI_BTN_EXIT = <fgui.GButton>(this.getChildAt(4));
		this.UI_BTN_EXIT.onClick(this.onBtnExit, this);
		this.UI_BTN_BACK = <fgui.GButton>(this.getChildAt(5));
		this.UI_BTN_BACK.onClick(this.onBtnBack, this);
	}
	onBtnExit():void{};
	onBtnBack():void{};
}
fgui.UIObjectFactory.setExtension(FGUITotalResultView.URL, FGUITotalResultView);