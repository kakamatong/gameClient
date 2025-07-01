/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";

export default class FGUILobbyView extends fgui.GComponent {

	public UI_IMG_BG:fgui.GImage;
	public static URL:string = "ui://gv22rev3sc722";

	public static packageName:string = "lobby";

	public static createInstance():FGUILobbyView {
		return <FGUILobbyView>(fgui.UIPackage.createObject("lobby", "LobbyView"));
	}

	protected onConstruct():void {
		this.UI_IMG_BG = <fgui.GImage>(this.getChildAt(0));
	}
}