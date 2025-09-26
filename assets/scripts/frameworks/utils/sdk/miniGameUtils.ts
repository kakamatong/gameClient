import { sys } from "cc";

export class MiniGameUtils {
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
}