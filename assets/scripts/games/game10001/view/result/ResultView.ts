import FGUIResultView from '../../../../fgui/game10001Result/FGUIResultView';
import * as fgui from "fairygui-cc";
import { GameData } from '../../data/Gamedata';
import { assetManager, AudioClip, log } from 'cc';

export class ResultView extends FGUIResultView { 
    private _continueFunc:(()=>void) | null = null;
    private _scoreData:Array<{userid:number, cpData:any, nickname:string}> = []
    show(data?:any){
        const flag = data?.flag ?? 0
        this.ctrl_flag.selectedIndex = flag;
        if (flag ===1) {
            this.playWinSound()
        }else if (flag === 0) {
            this.playLoseSound()
        }
        this.ctrl_roomType.selectedIndex = GameData.instance.isPrivateRoom ? 1 : 0
        
        this._continueFunc = data?.continueFunc
        this.act.play(()=>{
            this.UI_COMP_ACT.ctrl_show.selectedIndex = 1
        })

        if (data.scores && data.scores.length > 0) {
            this._scoreData = data.scores
            this.UI_LV_GAME_INFO.itemRenderer = this.itemRenderer.bind(this)
            this.UI_LV_GAME_INFO.numItems = data.scores.length
        }
    }

    playWinSound(){
        assetManager.loadBundle('sound', (err, bundle) => { 
            if (err) {
                log('loadBundle error', err);
                return;
            }

            bundle.load<AudioClip>('game10001/win', (err, asset: AudioClip) => { 
                if (err) {
                    log('loadBundle error', err);
                    return;
                }
                fgui.GRoot.inst.playOneShotSound(asset)
            })
        });
    }

    playLoseSound(){
        assetManager.loadBundle('sound', (err, bundle) => { 
            if (err) {
                log('loadBundle error', err);
                return;
            }

            bundle.load<AudioClip>('game10001/lose', (err, asset: AudioClip) => { 
                if (err) {
                    log('loadBundle error', err);
                    return;
                }
                fgui.GRoot.inst.playOneShotSound(asset)
            })
        });
    }

    itemRenderer(index:number, item:fgui.GObject){
        const itemData = this._scoreData[index];
        item.asCom.getChild('UI_TXT_NICKNAME').text = itemData.nickname;
        item.asCom.getChild('UI_TXT_ID').text = `${itemData.userid}`;
        if (GameData.instance.isPrivateRoom) {
            const msg = `胜${itemData.cpData.win ?? 0}`
            item.asCom.getChild('UI_TXT_SCORE').text = msg
        }else{
            item.asCom.getChild('UI_TXT_SCORE').text = `${itemData.cpData.dcp > 0 ? '+' : ''}${itemData.cpData.dcp}`;
        }
        
    }

    onBtnBack(): void {
        ResultView.hideView()
    }

    onBtnCon(): void {
        this._continueFunc && this._continueFunc()
        ResultView.hideView()
    }
}
fgui.UIObjectFactory.setExtension(ResultView.URL, ResultView);