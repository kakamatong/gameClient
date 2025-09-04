/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import { assetManager, AssetManager } from "cc";
import * as fgui from "fairygui-cc";

export default class FGUIdismissInfo extends fgui.GComponent {

	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_RESULT:fgui.GTextField;
	public static URL:string = "ui://ljshfpzynhct8";

	public static packageName:string = "test";

	public static showView(params?:any):void {
		const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;
		fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=> {

			if(error){console.log("loadPackage error", error);return;}
			const view = <FGUIdismissInfo>(fgui.UIPackage.createObject("test", "dismissInfo"));

			view.makeFullScreen();
			fgui.GRoot.inst.addChild(view);
			view.show && view.show(params);
		}
		);
	}

	public static createInstance():FGUIdismissInfo {
		return <FGUIdismissInfo>(fgui.UIPackage.createObject("test", "dismissInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_RESULT = <fgui.GTextField>(this.getChildAt(1));
	}
}
fgui.UIObjectFactory.setExtension(FGUIdismissInfo.URL, FGUIdismissInfo);