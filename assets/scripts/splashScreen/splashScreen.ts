import { _decorator, Component, log } from 'cc';
import { Socket } from '../frameworks/socket/socket';
const { ccclass, property } = _decorator;

@ccclass('splashScreen')
export class splashScreen extends Component {
    start() {
        log('splashScreen');
        const socket = new Socket();
        socket.init();
    }

    update(deltaTime: number) {
        
    }
}


