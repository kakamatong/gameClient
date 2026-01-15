/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUICompTotalResultInfo extends fgui.GComponent {

	public UI_COMP_HEAD:fgui.GComponent;
	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_ID:fgui.GTextField;
	public UI_TXT_WIN:fgui.GTextField;
	public UI_TXT_LOSE:fgui.GTextField;
	public static URL:string = "ui://5x18e99vkv65r";

	public static packageName:string = "game10001Result";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUICompTotalResultInfo.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("game10001Result", "CompTotalResultInfo") as FGUICompTotalResultInfo;

			view.makeFullScreen();
			FGUICompTotalResultInfo.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUICompTotalResultInfo.instance = null;
	}
	public static hideView():void {
		FGUICompTotalResultInfo.instance && FGUICompTotalResultInfo.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUICompTotalResultInfo {
		return <FGUICompTotalResultInfo>(fgui.UIPackage.createObject("game10001Result", "CompTotalResultInfo"));
	}

	protected onConstruct():void {
		this.UI_COMP_HEAD = <fgui.GComponent>(this.getChildAt(1));
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(2));
		this.UI_TXT_ID = <fgui.GTextField>(this.getChildAt(3));
		this.UI_TXT_WIN = <fgui.GTextField>(this.getChildAt(6));
		this.UI_TXT_LOSE = <fgui.GTextField>(this.getChildAt(7));
	}
}
fgui.UIObjectFactory.setExtension(FGUICompTotalResultInfo.URL, FGUICompTotalResultInfo);