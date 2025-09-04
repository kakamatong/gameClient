/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIrankInfo extends fgui.GComponent {

	public UI_TXT_RANK:fgui.GTextField;
	public UI_TXT_NAME:fgui.GTextField;
	public UI_TXT_SCORE:fgui.GTextField;
	public static URL:string = "ui://ljshfpzyeo9b4";

	public static packageName:string = "test";

	public static showView(params?:any):void {
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = <FGUIrankInfo>(fgui.UIPackage.createObject("test", "rankInfo"));

			view.makeFullScreen();
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static createInstance():FGUIrankInfo {
		return <FGUIrankInfo>(fgui.UIPackage.createObject("test", "rankInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_RANK = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_NAME = <fgui.GTextField>(this.getChildAt(1));
		this.UI_TXT_SCORE = <fgui.GTextField>(this.getChildAt(2));
	}
}
fgui.UIObjectFactory.setExtension(FGUIrankInfo.URL, FGUIrankInfo);