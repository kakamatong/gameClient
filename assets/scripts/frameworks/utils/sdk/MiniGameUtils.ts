import { sys } from "cc";

export class MiniGameUtils {

    private _userInfoBtn: any|null = null;
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
}