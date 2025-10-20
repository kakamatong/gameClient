import { assetManager, AudioClip, log } from "cc";
import * as fgui from "fairygui-cc";

export class SoundManager {
    /**
     * @property {string} _name - 管理器名称
     * @protected
     */
    protected _name: string = 'SoundManager'

    //单例
    private static _instance: SoundManager;
    public static get instance(): SoundManager {
        if (!this._instance) {
            this._instance = new SoundManager();
        }
        return this._instance;
    }

    constructor() {
        this.init();
    }

    init(){

    }

    load(url: string, callBack?: (err: any, asset: any) => void) {
        assetManager.loadBundle('sound', (err, bundle) => { 
            if (err) {
                log('loadBundle error', err);
                return;
            }

            bundle.load<AudioClip>(url, (err, asset: AudioClip) => { 
                if (err) {
                    log('loadBundle error', err);
                    return;
                }
                
                callBack && callBack(err, asset);
            })
        });
    }

    playOneShotSound(url:string){
        const callBack = (err:any, asset:AudioClip)=>{
            if (err) {
                return
            }
            fgui.GRoot.inst.playOneShotSound(asset)
        }
        this.load(url, callBack)
    }

}