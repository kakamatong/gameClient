import { _decorator, Component, log,sys,assetManager,BufferAsset,AssetManager} from 'cc';
import * as fgui from "fairygui-cc";

import { handleSocketMessage } from '../frameworks/config/config';
import { UIManager } from '../frameworks/uimanager';
import { ViewConfig } from '../view/ViewConfig';
const { ccclass, property } = _decorator;

@ccclass('splashScreen')
export class splashScreen extends Component {

    private client: any;

    start() {
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
        //testBinder.bindAll();
        const bundle = assetManager.getBundle('fgui') as AssetManager.Bundle;
        fgui.UIPackage.loadPackage(bundle, 'test', (error, pkg)=>{
            if(error){
                log('loadPackage error', error);
                return;
            }
            // const view = fgui.UIPackage.createObject('test', 'TestView', TestView) as TestView;
            // fgui.GRoot.inst.addChild(view);
            // view.onShow();
            // view.dispose();

            UIManager.instance.showView('TestView');

        });
    }


    // sendLogin() {
    //     console.log('sendLogin');
    //     const loginInfo = {
    //         username: 'admin',
    //         password: '123456',
    //         device: 'pc',
    //         version: '0.0.1'
    //     }
    //     this.request && this.sendMessage(this.request('auth', loginInfo, 100));
    // }
}
