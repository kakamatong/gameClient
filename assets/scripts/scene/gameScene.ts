import { _decorator, assetManager, AudioClip, AudioSourceComponent, Component,isValid,log, sys} from 'cc';
import * as fgui from "fairygui-cc";
import { GameView } from '../games/game10001/view/game/gameView';
import { LOCAL_KEY } from '../datacenter/InterfaceConfig';
const { ccclass, property } = _decorator;

@ccclass('gameScreen')
export class gameScreen extends Component {

    start() {
        this.initView()
    }

    initView(){
        fgui.GRoot.create()
        GameView.showView()

        // 加载背景音乐
        assetManager.loadBundle('sound', (err, bundle) => { 
            if (err) {
                log('loadBundle error', err);
                return;
            }

            bundle.load<AudioClip>('game10001/gamebg', (err, asset: AudioClip) => { 
                if (err) {
                    log('loadBundle error', err);
                    return;
                }
                let bgMusicOpen = 1;
                const localKey = sys.localStorage.getItem(LOCAL_KEY.BG_MUSIC_OPEN)
                if (localKey === null || localKey === undefined || localKey === '') {
                    bgMusicOpen = 1
                }else{
                    bgMusicOpen = parseInt(localKey)
                }

                const as = fgui.GRoot.inst.node.getComponent(AudioSourceComponent)
                if (!as) {
                    const newAs = fgui.GRoot.inst.node.addComponent(AudioSourceComponent)
                    newAs.clip = asset;
                    newAs.loop = true;
                    newAs.volume = bgMusicOpen;
                    newAs.play();
                }else{
                    as.clip = asset;
                    as.loop = true;
                    as.volume = bgMusicOpen;
                    as.play();
                }
            })
        });
    }

}
