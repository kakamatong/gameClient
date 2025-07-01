import { _decorator, Component, log,sys,assetManager,resources,AssetManager, JsonAsset} from 'cc';
import * as fgui from "fairygui-cc";

import { handleSocketMessage } from '../frameworks/config/config';
import { UIManager } from '../frameworks/uimanager';
import { ViewConfig } from '../view/viewConfig';
import { DataCenter } from '../datacenter/datacenter';
const { ccclass, property } = _decorator;

@ccclass('splashScreen')
export class splashScreen extends Component {

    start() {
        resources.load('appConfig/appConfig',(err,data:JsonAsset)=>{
            if(!err){
                DataCenter.instance.appConfig = data?.json
            }
        })

        UIManager.instance.initViewConfig(ViewConfig);
        assetManager.loadBundle('fgui', (err, bundle) => {
            if (err) {
                log('loadBundle error', err);
                return;
            }
            this.initView();
        });
        log('splashScreen');
    }

    initView(){
        fgui.GRoot.create()
        
        UIManager.instance.showView('TestView');
    }

}
