
import FGUIGameView from '../../../../fgui/game10001/FGUIGameView';
import { ViewClass } from '../../../../frameworks/Framework';
import * as fgui from "fairygui-cc";
/**
 * 游戏视图 - 只处理背景显示
 */
@ViewClass()
export class GameView extends FGUIGameView {

}

fgui.UIObjectFactory.setExtension(GameView.URL, GameView);