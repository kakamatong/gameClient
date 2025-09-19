/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompVoteInfo extends fgui.GComponent {

	public ctrl_result:fgui.Controller;
	public UI_COMP_HEAD:fgui.GComponent;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public static URL:string = "ui://2zsfe53xr1yn1";

	public static packageName:string = "game10001";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompVoteInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("game10001", "CompVoteInfo") as FGUICompVoteInfo;

			view.makeFullScreen();
			FGUICompVoteInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompVoteInfo.instance = null;
	}
	public static hideView():void {
		FGUICompVoteInfo.instance && FGUICompVoteInfo.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompVoteInfo {
		return <FGUICompVoteInfo>(fgui.UIPackage.createObject("game10001", "CompVoteInfo"));
	}

	protected onConstruct():void {
		this.ctrl_result = this.getControllerAt(0);
		this.UI_COMP_HEAD = <fgui.GComponent>(this.getChildAt(0));
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompVoteInfo.URL, FGUICompVoteInfo);