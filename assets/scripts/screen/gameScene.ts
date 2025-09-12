import { _decorator, Component, log,sys,assetManager,resources,AssetManager, JsonAsset} from 'cc';
import * as fgui from "fairygui-cc";
import { DataCenter } from '../datacenter/datacenter';
import { LobbyView } from "../view/lobby/lobbyView";
import { TestView } from '../view/testView';
const { ccclass, property } = _decorator;

@ccclass('gameScreen')
export class gameScreen extends Component {

    start() {
        
    }

    initView(){
        fgui.GRoot.create()
        // 加载common包
        // const bundle = assetManager.getBundle('fgui') as AssetManager.Bundle;
        // fgui.UIPackage.loadPackage(bundle, 'common', (error, pkg)=>{
        //     if(error){
        //         console.log('loadPackage error', error);
        //         return;
        //     }

        //     LobbyView.showView()
        //     //TestView.showView()
        // })
    }

}
