/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUImailTitle extends fgui.GComponent {

	public title:fgui.GTextField;
	public static URL:string = "ui://ljshfpzyeatn6";

	public static packageName:string = "test";

	public static createInstance():FGUImailTitle {
		return <FGUImailTitle>(fgui.UIPackage.createObject("test", "mailTitle"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChildAt(0));
	}
}