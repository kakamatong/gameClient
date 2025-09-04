/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUImailTitle extends fgui.GComponent {

	public ctrl_read:fgui.Controller;
	public title:fgui.GTextField;
	public static URL:string = "ui://ljshfpzyeatn6";

	public static packageName:string = "test";

	public static createInstance():FGUImailTitle {
		return <FGUImailTitle>(fgui.UIPackage.createObject("test", "mailTitle"));
	}

	protected onConstruct():void {
		this.ctrl_read = this.getControllerAt(0);
		this.title = <fgui.GTextField>(this.getChildAt(0));
	}
}
fgui.UIObjectFactory.setExtension(FGUImailTitle.URL, FGUImailTitle);