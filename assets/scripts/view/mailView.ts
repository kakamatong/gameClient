import { _decorator} from 'cc';
import FGUIMailView from '../fgui/test/FGUIMailView';
import { UIManager } from '../frameworks/uimanager'
import * as fgui from "fairygui-cc";
import { Mail } from '../modules/mail';
import { UserRiches } from '../modules/userRiches';
const { ccclass, property } = _decorator;
@ccclass('MailView')
export class MailView extends FGUIMailView {
    private _list:any[] = [];
    private _index:number = 0;
    constructor(){
        super();
    }

    onEnable(){
        super.onEnable();
        this.initUI();
    }

    onDisable(){
        super.onDisable();
    }

    
// id =
// 2
// status =
// 0
// time =
// '2025-08-11 15:35:22'
// title =
// '全服维护公告'
    show(data:any){
        this._list = data;
        this.UI_LV_MAILS.numItems = data.length;
    }

    initUI(){
        this.UI_LV_MAILS.itemRenderer = this.itemRenderer.bind(this)
    }

    updateContent(data:any){
        this.UI_TXT_CONTENT.text = data.content;
        if(data.awards && data.awards != ""){
            this.ctrl_award.selectedIndex = 1;
            if(data.status == 2){
                this.ctrl_get.selectedIndex = 1;
            }else{
                this.ctrl_get.selectedIndex = 0;
            }
        }else{
            this.ctrl_award.selectedIndex = 0;
        }
    }


    onBtnTitle(item:fgui.GComponent, index:number){
        this._index = index;
        const itemData = this._list[index];
        Mail.instance.detail(itemData.mailid, (success, data)=>{
            if (success) {
                console.log('detail success', data);
                this.updateContent(data);
            }
        })

        Mail.instance.read(itemData.mailid, (success, data)=>{
            if (success) {
                console.log('read success', data);
                if (!itemData.status){
                    itemData.status = 1;
                    item.getController('ctrl_read').selectedIndex = itemData.status;
                }
            }
        })
    }

    itemRenderer(index:number, item:fgui.GComponent){
        const itemData = this._list[index];
        item.getChild('title').text = itemData.title;
        item.onClick(()=>{
            this.onBtnTitle(item, index);
        })
        const tmp = itemData.status ? 1 : 0;

        item.getController('ctrl_read').selectedIndex = tmp;
    }

    onShow(){
        console.log('TestView onShow');
    }

    onBtnClose(){
        console.log('onBtnClose');
        //this.dispose();
        UIManager.instance.hideView('MailView');
    }

    onBtnGet(){
        const itemData = this._list[this._index];
        if(itemData.status == 2){
            return;
        }

        Mail.instance.getAwards(itemData.mailid, (success, data)=>{
            if (success) {
                console.log('getAwards success', data);
                itemData.status = 2;
                Mail.instance.detail(itemData.mailid, (success, data)=>{
                    if (success) {
                        console.log('detail success', data);
                        this.updateContent(data);
                        const userRiches = new UserRiches()
                        userRiches.req()
                    }
                })
            }
        })
    }
}
