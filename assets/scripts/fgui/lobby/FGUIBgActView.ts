/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

import { PackageManager } from "../../frameworks/PackageManager";

export default class FGUIBgActView extends fgui.GComponent {

	public UI_COMP_BG_ACT_1:fgui.GComponent;
	public UI_COMP_BG_ACT_2:fgui.GComponent;
	public UI_COMP_BG_ACT_3:fgui.GComponent;
	public UI_COMP_BG_ACT_4:fgui.GComponent;
	public static URL:string = "ui://gv22rev3xoqi5";

	public static packageName:string = "lobby";

	public static instance:any | null = null;

	public static showView(params?:any, callBack?:(b:boolean)=>void):void {
		if(FGUIBgActView.instance) {
			console.log("allready show");
			callBack&&callBack(false);
			return;
		}
		PackageManager.instance.loadPackage("fgui", this.packageName).then(()=> {

			const view = fgui.UIPackage.createObject("lobby", "BgActView") as FGUIBgActView;

			view.makeFullScreen();
			FGUIBgActView.instance = view;
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
			callBack&&callBack(true);
		}
		).catch(error=>{console.log("showView error", error);callBack&&callBack(false);return;});
	}

	protected onDestroy():void {
		super.onDestroy();
		FGUIBgActView.instance = null;
	}
	public static hideView():void {
		FGUIBgActView.instance && FGUIBgActView.instance.dispose();
	}

	show(data?:any):void{};

	public static createInstance():FGUIBgActView {
		return <FGUIBgActView>(fgui.UIPackage.createObject("lobby", "BgActView"));
	}

	protected onConstruct():void {
		this.UI_COMP_BG_ACT_1 = <fgui.GComponent>(this.getChildAt(0));
		this.UI_COMP_BG_ACT_2 = <fgui.GComponent>(this.getChildAt(1));
		this.UI_COMP_BG_ACT_3 = <fgui.GComponent>(this.getChildAt(2));
		this.UI_COMP_BG_ACT_4 = <fgui.GComponent>(this.getChildAt(3));
	}
}
fgui.UIObjectFactory.setExtension(FGUIBgActView.URL, FGUIBgActView);