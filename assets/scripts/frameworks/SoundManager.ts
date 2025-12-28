import { assetManager, AudioClip, AudioSourceComponent, log, sys } from "cc";
import * as fgui from "fairygui-cc";

/**
 * @enum LOCAL_KEY
 * @description 本地存储键值枚举
 */
export enum LOCAL_KEY {
    /**
     * @property {string} BG_MUSIC_OPEN - 背景音乐开启状态存储键
     */
    BG_MUSIC_OPEN = 'bgMusicOpen',
    /**
     * @property {string} EFFECT_SOUND_OPEN - 音效开启状态存储键
     */
    EFFECT_SOUND_OPEN = 'effectSoundOpen',
}

/**
 * @class SoundManager
 * @description 声音管理器，负责游戏中的背景音乐和音效播放管理
 * @category 框架组件
 */
export class SoundManager {
    /**
     * @property {string} _name - 管理器名称
     * @protected
     */
    protected _name: string = 'SoundManager'

    /**
     * @property {SoundManager} _instance - SoundManager单例实例
     * @private
     * @static
     */
    private static _instance: SoundManager;

    /**
     * @method instance
     * @description 获取SoundManager的单例实例
     * @static
     * @returns {SoundManager} SoundManager单例实例
     */
    public static get instance(): SoundManager {
        if (!this._instance) {
            this._instance = new SoundManager();
        }
        return this._instance;
    }

    /**
     * @constructor
     * @description 初始化声音管理器实例
     */
    constructor() {
        //this.init();
    }

    /**
     * @method init
     * @description 初始化声音设置，根据本地存储设置音效开关状态
     */
    init(){
        const open = this.getSoundEffectOpen()
        if (open) {
            this.openSoundEffect()
        }else{
            this.closeSoundEffect()
        }
    }

    /**
     * @method load
     * @description 加载声音资源
     * @param {string} url - 声音资源路径
     * @param {(err: any, asset: any) => void} [callBack] - 加载完成回调函数
     */
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

    /**
     * @method playSoundEffect
     * @description 播放音效
     * @param {string} url - 音效资源路径
     */
    playSoundEffect(url:string){
        const callBack = (err:any, asset:AudioClip)=>{
            if (err) {
                return
            }
            fgui.GRoot.inst.playOneShotSound(asset)
        }
        this.load(url, callBack)
    }

    /**
     * @method playSoundEffect
     * @description 播放音效
     * @param {string} url - 音效资源路径
     */
    playSoundEffect2(obj:fgui.GObject, url:string){
        const callBack = (err:any, asset:AudioClip)=>{
            if (err) {
                return
            }
            const node = obj.node;
            const as = node.getComponent(AudioSourceComponent)
            if (!as) {
                const newAs = fgui.GRoot.inst.node.addComponent(AudioSourceComponent)
                newAs.clip = asset;
                newAs.loop = false;
                newAs.volume = fgui.GRoot.inst.volumeScale;
                newAs.play();
            }else{
                as.clip = asset;
                as.loop = false;
                as.volume = fgui.GRoot.inst.volumeScale;
                as.play();
            }

        }
        this.load(url, callBack)
    }

    /**
     * @method playSoundMusic
     * @description 播放背景音乐
     * @param {string} url - 背景音乐资源路径
     */
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

    /**
     * @method openSoundEffect
     * @description 开启音效
     */
    openSoundEffect():void{ 
        fgui.GRoot.inst.volumeScale = 1
        sys.localStorage.setItem(LOCAL_KEY.EFFECT_SOUND_OPEN, "1")
    }

    /**
     * @method closeSoundEffect
     * @description 关闭音效
     */
    closeSoundEffect():void{ 
        fgui.GRoot.inst.volumeScale = 0
        sys.localStorage.setItem(LOCAL_KEY.EFFECT_SOUND_OPEN, "0")
    }

    /**
     * @method openSoundMusic
     * @description 开启背景音乐
     */
    openSoundMusic():void{ 
        const as = fgui.GRoot.inst.node.getComponent(AudioSourceComponent)
        as && (as.volume = 1)
        sys.localStorage.setItem(LOCAL_KEY.BG_MUSIC_OPEN, "1")
    }

    /**
     * @method closeSoundMusic
     * @description 关闭背景音乐
     */
    closeSoundMusic():void{ 
        const as = fgui.GRoot.inst.node.getComponent(AudioSourceComponent)
        as && (as.volume = 0)
        sys.localStorage.setItem(LOCAL_KEY.BG_MUSIC_OPEN, "0")
    }

    /**
     * @method changeSoundEffect
     * @description 切换音效开关状态
     * @returns {number} 切换后的音效开关状态，1为开启，0为关闭
     */
    changeSoundEffect():number{ 
        const open = this.getSoundEffectOpen();
        const newOpen = open === 1 ? 0 : 1
        if (newOpen) {
            this.openSoundEffect()
        }else{
            this.closeSoundEffect()
        }

        return newOpen
    }

    /**
     * @method changeSoundMusic
     * @description 切换背景音乐开关状态
     * @returns {number} 切换后的背景音乐开关状态，1为开启，0为关闭
     */
    changeSoundMusic():number{ 
        const open = this.getSoundMusicOpen();
        const newOpen = open === 1 ? 0 : 1

        if (newOpen) {
            this.openSoundMusic()
        }else{
            this.closeSoundMusic()
        }

        return newOpen
    }

    /**
     * @method getSoundEffectOpen
     * @description 获取音效开关状态
     * @returns {number} 音效开关状态，1为开启，0为关闭
     */
    getSoundEffectOpen():number{ 
        let open = 1;
        const localKey = sys.localStorage.getItem(LOCAL_KEY.EFFECT_SOUND_OPEN)
        if (localKey === null || localKey === undefined || localKey === '') {
            open = 1
        }else{
            open = parseInt(localKey)
        }
        return open
    }

    /**
     * @method getSoundMusicOpen
     * @description 获取背景音乐开关状态
     * @returns {number} 背景音乐开关状态，1为开启，0为关闭
     */
    getSoundMusicOpen():number{ 
        let open = 1;
        const localKey = sys.localStorage.getItem(LOCAL_KEY.BG_MUSIC_OPEN)
        if (localKey === null || localKey === undefined || localKey === '') {
            open = 1
        }else{
            open = parseInt(localKey)
        }
        return open
    }
}