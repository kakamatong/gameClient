
import FGUILobbyView from '../../fgui/lobby/FGUILobbyView';
import * as fgui from "fairygui-cc";
import { PackageLoad, ViewClass } from '../../frameworks/Framework';

/**
 * 大厅视图
 */
@PackageLoad(['common','props'])
@ViewClass()
export class LobbyView extends FGUILobbyView {
    

}
// 继承出来的对象，必须重写
fgui.UIObjectFactory.setExtension(LobbyView.URL, LobbyView);