import { _decorator} from 'cc';
import FGUIGameView from '../fgui/test/FGUIGameView';
import { SocketManager } from '../frameworks/socketManager';
import { LogColors } from '../frameworks/framework';

const { ccclass, property } = _decorator;
@ccclass('GameView')
export class GameView extends FGUIGameView {
    constructor(){
        super();
    }

    onEnable(){
        SocketManager.instance.sendToServer('connectGame', { code:1 }, this.respConnectGame.bind(this))
    }

    onDisable(){

    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        this.dispose();
    }

    respConnectGame(data: any): void {
        if(data.code == 0){
            console.log(LogColors.green(data.msg));
        }else{
            console.log(LogColors.red(data.msg));
        }
    }
    
}
