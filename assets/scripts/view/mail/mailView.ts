import FGUIMatchView from '../../fgui/mail/FGUIMailView';
import * as fgui from "fairygui-cc";

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
        
    }
    

    onBtnClose(): void {
        MailView.hideView();
    }
}
fgui.UIObjectFactory.setExtension(MailView.URL, MailView);