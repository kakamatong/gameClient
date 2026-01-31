/**
 * @file LobbyView.ts
 * @description 大厅视图：游戏主大厅界面
 * @category 大厅视图
 */

import FGUILobbyView from '../../fgui/lobby/FGUILobbyView';
import * as fgui from "fairygui-cc";
import { PackageLoad, ViewClass } from '../../frameworks/Framework';

/**
 * @class LobbyView
 * @description 大厅视图，游戏主界面
 * @category 大厅视图
 */
@PackageLoad(['common','props'])
@ViewClass()
export class LobbyView extends FGUILobbyView {


}
// 继承出来的对象，必须重写
fgui.UIObjectFactory.setExtension(LobbyView.URL, LobbyView);