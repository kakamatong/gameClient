/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIBgActView extends fgui.GComponent {

	public UI_COMP_BG_ACT_1:fgui.GComponent;
	public UI_COMP_BG_ACT_2:fgui.GComponent;
	public UI_COMP_BG_ACT_3:fgui.GComponent;
	public UI_COMP_BG_ACT_4:fgui.GComponent;
	public static URL:string = "ui://gv22rev3xoqi5";

	public static packageName:string = "lobby";

	public static showView(params?:any):void {
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = <FGUIBgActView>(fgui.UIPackage.createObject("lobby", "BgActView"));

			view.makeFullScreen();
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

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