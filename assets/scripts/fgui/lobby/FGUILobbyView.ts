/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import * as fgui from "fairygui-cc";
import FGUIBgActView from "./FGUIBgActView";

export default class FGUILobbyView extends fgui.GComponent {

	public UI_IMG_BG:fgui.GImage;
	public UI_COMP_BG_ACT:FGUIBgActView;
	public UI_BTN_MATCH_ROOM:fgui.GButton;
	public UI_BTN_PRIVATE_ROOM:fgui.GButton;
	public static URL:string = "ui://gv22rev3sc722";

	public static packageName:string = "lobby";

	public static createInstance():FGUILobbyView {
		return <FGUILobbyView>(fgui.UIPackage.createObject("lobby", "LobbyView"));
	}

	protected onConstruct():void {
		this.UI_IMG_BG = <fgui.GImage>(this.getChildAt(0));
		this.UI_COMP_BG_ACT = <FGUIBgActView>(this.getChildAt(1));
		this.UI_BTN_MATCH_ROOM = <fgui.GButton>(this.getChildAt(2));
		this.UI_BTN_MATCH_ROOM.onClick(this.onBtnMatchRoom, this);
		this.UI_BTN_PRIVATE_ROOM = <fgui.GButton>(this.getChildAt(3));
		this.UI_BTN_PRIVATE_ROOM.onClick(this.onBtnPrivateRoom, this);
	}
	onBtnMatchRoom():void{};
	onBtnPrivateRoom():void{};
}
fgui.UIObjectFactory.setExtension(FGUILobbyView.URL, FGUILobbyView);