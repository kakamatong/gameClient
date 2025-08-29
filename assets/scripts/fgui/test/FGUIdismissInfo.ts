/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUIdismissInfo extends fgui.GComponent {

	public UI_TXT_NICKNAME:fgui.GTextField;
	public UI_TXT_RESULT:fgui.GTextField;
	public static URL:string = "ui://ljshfpzynhct8";

	public static packageName:string = "test";

	public static createInstance():FGUIdismissInfo {
		return <FGUIdismissInfo>(fgui.UIPackage.createObject("test", "dismissInfo"));
	}

	protected onConstruct():void {
		this.UI_TXT_NICKNAME = <fgui.GTextField>(this.getChildAt(0));
		this.UI_TXT_RESULT = <fgui.GTextField>(this.getChildAt(1));
	}
}