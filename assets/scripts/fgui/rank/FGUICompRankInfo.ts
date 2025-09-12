/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUICompRankInfo extends fgui.GComponent {

	public UI_TXT_RANK:fgui.GTextField;
	public UI_TXT_NAME:fgui.GTextField;
	public UI_TXT_SCORE:fgui.GTextField;
	public static URL:string = "ui://2a32uf5yis911";

	public static packageName:string = "rank";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompRankInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);callBack&&callBack(false);return;}
			const view = fgui.UIPackage.createObject("rank", "CompRankInfo") as FGUICompRankInfo;

			view.makeFullScreen();
			FGUICompRankInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		);
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompRankInfo.instance = null;
	}
	public static hideView():void {
		FGUICompRankInfo.instance && FGUICompRankInfo.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompRankInfo {
		return <FGUICompRankInfo>(fgui.UIPackage.createObject("rank", "CompRankInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_RANK = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_NAME = <fgui.GTextField>(this.getChildAt(1));
		this.UI_TXT_SCORE = <fgui.GTextField>(this.getChildAt(2));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompRankInfo.URL, FGUICompRankInfo);