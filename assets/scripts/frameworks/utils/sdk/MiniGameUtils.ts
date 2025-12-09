import { sys } from "cc";
import { DispatchEvent } from "../../Framework";

export class MiniGameUtils {

    private _userInfoBtn: any|null = null;

    private _canvas: HTMLCanvasElement | null = null;

    private _interstitialAdList: Record<string,any> = {};


    private _canvasContext: CanvasRenderingContext2D | null = null;
    /**
     * @property {MiniGameUtils} _instance - 单例实例
     * @private
     * @static
     */
    private static _instance: MiniGameUtils;
    
    /**
     * @method instance
     * @description 获取MiniGameUtils的单例实例
     * @static
     * @returns {MiniGameUtils} MiniGameUtils单例实例
     */
    public static get instance(): MiniGameUtils {
        if (!this._instance) {
            this._instance = new MiniGameUtils();
        }
        return this._instance;
    }

    constructor() { 
        this.init()
    }

    init(){
        if (this.isWeChatGame()) {
            wx && wx.onShow((res:any) => { 
                console.log('App Show', res)
                DispatchEvent('onShow',res)
            })
        }
    }

    isThirdPlatform():boolean { 
        return this.isWeChatGame()
    }

    isWeChatGame():boolean { 
        return sys.platform === sys.Platform.WECHAT_GAME;
    }

    request(url: string, method: string, headers: any, body: any): Promise<any> {
        if (this.isWeChatGame()) {
            return new Promise((resolve, reject) => { 
                wx && wx.request({
                    url: url,
                    method: method,
                    header: headers,
                    data: JSON.stringify(body),
                    success: (res:any) => { 
                        resolve(res.data);
                    },
                    fail: (res:any) => { 
                        reject(res);
                    }
                })
            });
        }
    
        return new Promise((resolve, reject) => { 
            fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(body),
            }).then(response => { 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    login(data?:any, callBack?:(success:boolean, data?:any)=>void){
        if (this.isWeChatGame()) {
            wx && wx.login({
                timeout: 5000,
                success: (data:any) => { 
                    callBack && callBack(true,data.code)
                },

                fail: (errMsg:string, errno:number) => {
                    callBack && callBack(false,{errMsg:errMsg, errno:errno})
                }
            })
        }
    }

    requirePrivacyAuthorize(callBack1:(success:boolean)=>void, callBack2:(resolve:Function)=>void){
        if (this.isWeChatGame()) {
            wx && wx.onNeedPrivacyAuthorization((resolve:any, eventInfo:any)=>{
                console.log('触发本次事件的接口是：' + eventInfo.referrer)
                callBack2 && callBack2(resolve)
            })

            wx && wx.requirePrivacyAuthorize({
                success:()=>{
                    callBack1 && callBack1(true)
                },
                fail:()=>{
                    callBack1 && callBack1(false)
                },
            })
        }
    }

    openPrivacyContract(data?:any){
        if (this.isWeChatGame()) {
            wx && wx.openPrivacyContract({
                success: (res:any) => { 
                    console.log('隐私协议成功打开')
                },
                fail: (res:any) => { 
                    console.log('隐私协议打开失败')
                }
            })
        }
    }

    getSystemInfoSync(){
        if (this.isWeChatGame()) {
            return wx && wx.getSystemInfoSync()
        }else{
            return {screenWidth: 0, screenHeight: 0}
        }
        
    }

    createUserInfoButton(data:any){
        if (this.isWeChatGame()) {
            if (!this._userInfoBtn) {
                console.log("创建按钮")
                this._userInfoBtn = wx && wx.createUserInfoButton({
                    type: 'image',
                    image: '',
                    style: {
                        left: data.left,
                        top: data.top,
                        width: data.width,
                        height: data.height,
                        backgroundColor: '',
                        color: '',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    }
                })

                this._userInfoBtn.onTap((res:any) => { 
                    console.log('用户点击了按钮')
                    if (res.userInfo) {
                        data.callBack && data.callBack(res.userInfo)
                    }else{
                        data.callBack && data.callBack(null)
                    }
                    
                })
                this._userInfoBtn.show()
            }
        }
    }

    destroyUserInfoButton(){
        if (this._userInfoBtn) {
            this._userInfoBtn.destroy()
            this._userInfoBtn = null
        }
    }

    shareAppMessage(data:{title:string, imageUrl:string, query:string}):void{
        if (this.isWeChatGame()) {
            wx && wx.shareAppMessage({
                title: data.title,
                imageUrl: data.imageUrl,
                query: data.query
            })
        }
    }

    getLaunchOptionsSync():any{
        if (this.isWeChatGame()) {
            return wx && wx.getLaunchOptionsSync()
        }else{
            return {}
        }
    }

    getCanvas(): HTMLCanvasElement | null{
        if (this.isWeChatGame()) {
            if (!this._canvas) {
                this._canvas = wx && wx.createCanvas()
            }
        }else{
            if (!this._canvas) {
                this._canvas = document.createElement('canvas')
            }
        }

        return this._canvas
    }

    getCanvasContext(): CanvasRenderingContext2D | null{
        if (!this._canvasContext) {
            const canvas = this.getCanvas()
            this._canvasContext = (canvas && canvas.getContext('2d'))
        }

        return this._canvasContext
    }

    createImage(): HTMLImageElement{ 
        if (this.isWeChatGame()) {
            return wx && wx.createImage()
        }else{
            return new Image()
        }
    }

    async loadImage(url:string): Promise<HTMLImageElement>{ 
        return new Promise((resolve, reject) => { 
            const image = this.createImage();
            image.crossOrigin = 'anonymous';
            image.onload = () => { 
                resolve(image);
            };
            image.onerror = (error) => { 
                reject(error);
            };
            image.src = url;

        });
    }

    async makeCanvasImage(options:{filename:string, format?:'png' | 'jpeg' | 'webp', quality?:number}): Promise<string>{ 
        return new Promise((resolve, reject) => { 
            if (this.isWeChatGame()) {
                (this._canvas as any).toTempFilePath({
                    success: (res:any) => {
                        resolve(res.tempFilePath);
                    }
                })
            }else{
                this._canvas?.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas 转换 Blob 失败'));
                        return;
                    }

                    try {
                        // 创建对象 URL
                        const objectURL = URL.createObjectURL(blob);
                        
                        // 创建下载链接
                        const link = document.createElement('a');
                        link.href = objectURL;
                        link.download = `${options.filename}.${options.format ?? 'jpeg'}`;
                        link.style.display = 'none';
                        
                        // 添加到文档并触发下载
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // 返回对象 URL（可以当作临时本地地址使用）
                        resolve(objectURL);
                    } catch (error) {
                        reject(error);
                    }
                    },
                    `image/${options.format ?? 'jpeg'}`,
                    options.quality ?? 1
                );
                /////
            }
        })
     }

     /**
     * 创建插屏广告
     * @param key 
     * @returns 
     */
     createInterstitialAd(key:string):any{ 
        if (this.isWeChatGame()) { 
            return (wx && wx.createInterstitialAd({
                adUnitId: key
            }))
        }
     }

     /**
     * 显示插屏广告
     * @param key 
     */
     showInterstitialAd(key:string){
        if(this.isWeChatGame()){
            if (this._interstitialAdList[key]) {
                this._interstitialAdList[key].show().catch((error:any) => { 
                    // 失败重试
                    console.error("插屏广告显示失败", error)
                })
            }else{
                this._interstitialAdList[key] = this.createInterstitialAd(key)
                this._interstitialAdList[key].show().catch((error:any) => { 
                    // 失败重试
                    console.error("插屏广告显示失败", error)
                })
            }
        }
    }

    
}