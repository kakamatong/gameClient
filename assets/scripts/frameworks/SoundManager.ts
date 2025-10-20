import { assetManager, AudioClip, AudioSourceComponent, log, sys } from "cc";
import * as fgui from "fairygui-cc";
export enum LOCAL_KEY {
    BG_MUSIC_OPEN = 'bgMusicOpen',
    EFFECT_SOUND_OPEN = 'effectSoundOpen',
}
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

    playSoundEffect(url:string){
        const callBack = (err:any, asset:AudioClip)=>{
            if (err) {
                return
            }
            fgui.GRoot.inst.playOneShotSound(asset)
        }
        this.load(url, callBack)
    }

    playSoundMusic(url:string){
        const callBack = (err:any, asset:AudioClip)=>{
            if (err) {
                return
            }
            let bgMusicOpen = 1;
            const localKey = sys.localStorage.getItem(LOCAL_KEY.BG_MUSIC_OPEN)
            if (localKey === null || localKey === undefined || localKey === '') {
                bgMusicOpen = 1
            }else{
                bgMusicOpen = parseInt(localKey)
            }
            const as = fgui.GRoot.inst.node.getComponent(AudioSourceComponent)
            if (!as) {
                const newAs = fgui.GRoot.inst.node.addComponent(AudioSourceComponent)
                newAs.clip = asset;
                newAs.loop = true;
                newAs.volume = bgMusicOpen;
                newAs.play();
            }else{
                as.clip = asset;
                as.loop = true;
                as.volume = bgMusicOpen;
                as.play();
            }
            
        }
        this.load(url, callBack)
    }
}