import FGUIMatchView from '../../fgui/mail/FGUIMailView';
import * as fgui from "fairygui-cc";
import { Mail } from '../../modules/Mail';
import { LoadingView } from '../common/LoadingView';
import { ViewClass } from '../../frameworks/Framework';

@ViewClass()
export class MailView extends FGUIMatchView {
    private _list:any[] = [];
            
    show(data?: any):void{
        if(data && data.length > 0){
            this._list = data
            this.UI_LV_LIST.itemRenderer = this.itemRenderer.bind(this)
            this.UI_LV_LIST.numItems = data.length
            this.ctrl_have.selectedIndex = 1;
        }else{
            this.ctrl_have.selectedIndex = 0;
        }
    }

    itemRenderer(index:number, item:fgui.GObject){
        const itemData = this._list[index];
        item.asCom.getChild('UI_TXT_TITLE').text = itemData.title;
        item.asCom.getChild('UI_TXT_TIME').text = `过期：${itemData.endTime}`;
        item.asCom.onClick(()=>{
            this.onBtnTitle(item, index);
        })
        const tmp = itemData.status > 0 ? 1 : 0;

        item.asCom.getController('ctrl_read').selectedIndex = tmp;
    }

    onBtnTitle(item:fgui.GObject, index:number): void { 
        const itemData = this._list[index];
        LoadingView.showView({content:"拉取数据中...", time:12});
        Mail.instance.detail(itemData.id, (success, data)=>{
            LoadingView.hideView();
            if (success) {
                console.log('detail success', data);
                this.UI_COMP_CONTENT.visible = true
                this.UI_COMP_CONTENT.title.text = data.content
            }
        })

        Mail.instance.read(itemData.id, (success, data)=>{
            if (success) {
                console.log('read success', data);
                if (!itemData.status){
                    itemData.status = 1;
                    item.asCom.getController('ctrl_read').selectedIndex = itemData.status;
                }
            }
        })
    }
    

    onBtnClose(): void {
        MailView.hideView();
    }
}
fgui.UIObjectFactory.setExtension(MailView.URL, MailView);