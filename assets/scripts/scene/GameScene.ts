import { _decorator, Component} from 'cc';
import * as fgui from "fairygui-cc";
import { GameView } from '../games/game10001/view/game/GameView';
import { SoundManager } from '../frameworks/SoundManager';
const { ccclass } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    start() {
        this.initView()
    }

    initView(){
        fgui.GRoot.create()
        GameView.showView()

        // 加载背景音乐
        SoundManager.instance.init() // 切场景必须init
        SoundManager.instance.playSoundMusic('game10001/gamebg')
    }

}
