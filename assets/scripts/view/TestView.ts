import { _decorator} from 'cc';
import FGUITestView from '../fgui/test/FGUITestView';
const { ccclass, property } = _decorator;
@ccclass('TestView')
export class TestView extends FGUITestView {
    constructor(){
        super();
        console.log('TestView constructor');
    }

    onShow(){
        console.log('TestView onShow');
    }
    
}
