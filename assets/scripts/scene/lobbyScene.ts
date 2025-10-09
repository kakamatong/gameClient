import { _decorator, Component, log,sys,assetManager,resources,AssetManager, JsonAsset, AudioClip, AudioSourceComponent} from 'cc';
import * as fgui from "fairygui-cc";
import { DataCenter } from '../datacenter/datacenter';
import { LobbyView } from "../view/lobby/lobbyView";
import { ENUM_CHANNEL_ID, LOCAL_KEY } from '../datacenter/interfaceConfig';
import { LoginView } from '../view/login/loginView';
const { ccclass } = _decorator;

@ccclass('lobbyScreen')
export class lobbyScreen extends Component {
    start() {

        resources.load('appConfig/appConfig',(err,data:JsonAsset)=>{
            if(!err){
                DataCenter.instance.appConfig = data?.json
                DataCenter.instance.channelID = DataCenter.instance.appConfig.channelID ?? ENUM_CHANNEL_ID.ACCOUNT
            }
        })

        assetManager.loadBundle('fgui', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }
            this.initView();
        });
        log('LobbyScreen');
    }

    initView(){
        fgui.GRoot.create()
        // 加载common包
        const bundle = assetManager.getBundle('fgui') as AssetManager.Bundle;
        fgui.UIPackage.loadPackage(bundle, 'common', (error, pkg)=>{
            if(error){
                console.log('loadPackage error', error);
                return;
            }

            const agree = sys.localStorage.getItem(LOCAL_KEY.AGREE_PRIVACY) ?? 0;
            if (agree) {
                LobbyView.showView()
            }else{
                LoginView.showView()
            }
        })

        // 加载背景音乐
        assetManager.loadBundle('sound', (err, bundle) => { 
            if (err) {
                log('loadBundle error', err);
                return;
            }

            bundle.load<AudioClip>('lobby/bg', (err, asset: AudioClip) => { 
                if (err) {
                    log('loadBundle error', err);
                    return;
                }
                let bgMusicOpen = 1;
                const localKey = sys.localStorage.getItem(LOCAL_KEY.BG_MUSIC_OPEN)
                if (!localKey || localKey == '') {
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
