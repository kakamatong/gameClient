import FGUITotalResultView from '../../../../fgui/game10001Result/FGUITotalResultView';
import * as fgui from "fairygui-cc";
import { GameData } from '../../data/Gamedata';
import { SpriteFrame } from 'cc';
import { GameSocketManager } from '../../../../frameworks/GameSocketManager';
import { ChangeScene } from '../../../../frameworks/Framework';

export class TotalResultView extends FGUITotalResultView { 
    private _data:any | null = null;
    show(data?:any){
        this.UI_LV_INFO.itemRenderer = this.itemRenderer.bind(this)
        this._data = data
        if (this._data) {
            if (this._data.totalResultInfo && this._data.totalResultInfo.length > 0) {
                this.UI_LV_INFO.numItems = this._data.totalResultInfo.length
            }
        }
    }

    itemRenderer(index:number, item:fgui.GObject){
        const dataItem = this._data?.totalResultInfo[index]
        if (dataItem) {
            const player = GameData.instance.getPlayerByUserid(dataItem.userid);
            item.asCom.getChild("UI_TXT_NICKNAME").text = player?.nickname ?? ''
            item.asCom.getChild("UI_TXT_ID").text = `${dataItem.userid}`
            item.asCom.getChild("UI_TXT_WIN").text = `${dataItem.win}`
            item.asCom.getChild("UI_TXT_LOSE").text = `${dataItem.lose}`
            const headurl = GameData.instance.getHeadurlByUserid(dataItem.userid);
            const headNode = item.asCom.getChild("UI_COMP_HEAD").asCom.getChild("UI_LOADER_HEAD") as fgui.GLoader;
            headNode.url = headurl
        }
    }

    onBtnBack(): void {
        TotalResultView.hideView()
    }

    onBtnExit(): void {
        if (GameSocketManager.instance.isOpen()) {
            GameSocketManager.instance.close()
        }
        ChangeScene('LobbyScene')
    }

}
fgui.UIObjectFactory.setExtension(TotalResultView.URL, TotalResultView);