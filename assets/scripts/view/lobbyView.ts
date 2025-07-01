import { _decorator} from 'cc';
import FGUILobbyView from '../fgui/lobby/FGUILobbyView';
const { ccclass, property } = _decorator;

@ccclass('LobbyView')
export class LobbyView extends FGUILobbyView {

    onEnable(){
        super.onEnable();
    }

    onDisable(){
        super.onDisable();
    }

}