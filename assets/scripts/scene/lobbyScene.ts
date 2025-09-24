import { _decorator, Component, log,sys,assetManager,resources,AssetManager, JsonAsset} from 'cc';
import * as fgui from "fairygui-cc";
import { DataCenter } from '../datacenter/datacenter';
import { LobbyView } from "../view/lobby/lobbyView";
import { LOCAL_KEY } from '../datacenter/interfaceConfig';
import { LoginView } from '../view/login/loginView';
const { ccclass } = _decorator;

@ccclass('lobbyScreen')
export class lobbyScreen extends Component {

    start() {
        resources.load('appConfig/appConfig',(err,data:JsonAsset)=>{
            if(!err){
                DataCenter.instance.appConfig = data?.json
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
    }

}
