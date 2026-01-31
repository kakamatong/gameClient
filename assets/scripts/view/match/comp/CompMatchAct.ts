/**
 * @file CompMatchAct.ts
 * @description 匹配动画组件：显示匹配时的随机动画效果
 * @category 匹配视图
 */

import FGUICompMatchAct from '../../../fgui/match/FGUICompMatchAct';
import * as fgui from "fairygui-cc";
import {GetRandomInt} from '../../../frameworks/utils/Utils'
import { ViewClass } from '../../../frameworks/Framework';

/**
 * @class CompMatchAct
 * @description 匹配动画组件，显示匹配时的随机动画效果
 * @category 匹配视图
 */
@ViewClass()
export class CompMatchAct extends FGUICompMatchAct {
    /** 控制器列表 */
    private _ctrls:Array<fgui.Controller> = []
    /** 当前索引 */
    private _nowIndex = 0;
    /** 定时器回调函数 */
    private _scheid:(()=>void) | null = null;

    /**
     * @description 构造函数，初始化定时器和控制器
     */
    protected onConstruct(){
        super.onConstruct();
        this._scheid = this.change.bind(this)
        this.schedule(this._scheid, 0.2)
        this._ctrls.push(this.ctrl_act_0)
        this._ctrls.push(this.ctrl_act_1)
        this._ctrls.push(this.ctrl_act_2)
    }

    /**
     * @description 改变控制器状态
     */
    change(){
        const nowCtrl = this._ctrls[this._nowIndex]
        nowCtrl.selectedIndex = this.random(nowCtrl.selectedIndex)
        this._nowIndex++;
        this._nowIndex = this._nowIndex % this._ctrls.length
    }

    /**
     * @description 随机生成不等于 n 的索引
     * @param n 排除的索引
     * @returns 随机索引
     */
    random(n:number):number{
        const tmp:number[] = []
        for (let index = 0; index < this._ctrls.length; index++) {
            if (index != n) {
                tmp.push(index)
            }
        }
        const newn = GetRandomInt(0, tmp.length - 1)
        return tmp[newn];
    }

    /**
     * @description 停止定时器
     */
    stopSche():void{
        this._scheid && this.unschedule(this._scheid)
    }

    /**
     * @description 显示成功状态，所有控制器设置为相同状态
     */
    success():void{
        const n = GetRandomInt(0, this._ctrls.length - 1)
        this.ctrl_act_0.selectedIndex = n
        this.ctrl_act_1.selectedIndex = n
        this.ctrl_act_2.selectedIndex = n
    }

}
fgui.UIObjectFactory.setExtension(CompMatchAct.URL, CompMatchAct);