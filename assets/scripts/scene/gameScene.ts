import { _decorator, Component} from 'cc';
import * as fgui from "fairygui-cc";
import { GameView } from '../games/game10001/view/gameView';
const { ccclass, property } = _decorator;

@ccclass('gameScreen')
export class gameScreen extends Component {

    start() {
        this.initView()
    }

    initView(){
        fgui.GRoot.create()
        GameView.showView()
    }

}
