import { _decorator, Component, log,sys,assetManager,resources,AssetManager, JsonAsset, AudioClip, AudioSourceComponent, isValid} from 'cc';
import * as fgui from "fairygui-cc";
import { DataCenter } from '../datacenter/Datacenter';
import { LobbyView } from "../view/lobby/LobbyView";
import { ENUM_CHANNEL_ID, ENUM_ENV, LOCAL_KEY } from '../datacenter/InterfaceConfig';
import { LoginView } from '../view/login/LoginView';
import { SoundManager } from '../frameworks/SoundManager';
const { ccclass } = _decorator;

@ccclass('LobbyScreen')
export class LobbyScreen extends Component {
    start() {

        resources.load('appConfig/appConfig',(err,data:JsonAsset)=>{
            if(!err){
                DataCenter.instance.appConfig = data?.json
                // 开发环境处理
                if (DataCenter.instance.isEnvDev()) {
                    DataCenter.instance.appConfig.authList = DataCenter.instance.appConfig.authList_dev
                    DataCenter.instance.appConfig.webUrl = DataCenter.instance.appConfig.webUrl_dev
                }

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
        SoundManager.instance.init() // 切场景必须init
        SoundManager.instance.playSoundMusic('lobby/bg')
    }

}
