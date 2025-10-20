import { _decorator, assetManager, AudioClip, AudioSourceComponent, Component,log, sys} from 'cc';
import * as fgui from "fairygui-cc";
import { GameView } from '../games/game10001/view/game/GameView';
import { SoundManager } from '../frameworks/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('GameScreen')
export class GameScreen extends Component {

    start() {
        this.initView()
    }

    initView(){
        fgui.GRoot.create()
        GameView.showView()

        // 加载背景音乐
        SoundManager.instance.playSoundMusic('game10001/gamebg')
    }

}
