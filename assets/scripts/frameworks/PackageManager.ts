import { AssetManager, assetManager } from "cc";
import * as fgui from "fairygui-cc";

export class PackageManager {

     /**
     * @property {PackageManager} _instance - PackageManager单例实例
     * @private
     * @static
     */
    private static _instance: PackageManager;

    /**
     * @method instance
     * @description 获取PackageManager的单例实例
     * @static
     * @returns {PackageManager} PackageManager单例实例
     */
    public static get instance(): PackageManager {
        if (!this._instance) {
            this._instance = new PackageManager();
        }
        return this._instance;
    }

    /**
     * @property {Record<string, string[]>} _packages - 包含所有已加载包的映射表
     * @private
     */
    private _packages: Record<string, string[]> = {};

    /**
     * @constructor
     * @description 创建一个PackageManager的实例
     */
    constructor() {

    }

    /**
     * @method hasPackage
     * @description 检查包是否存在
     * @param {string} bundleName - bundle包名
     * @param {string} packageName - 包含的包名
     * @returns {boolean} 
     */
    hasPackage(bundleName: string, packageName: string): boolean {
        return this._packages[bundleName] && this._packages[bundleName].includes(packageName);
    }

    /**
     * @method hasBundle
     * @description 检查bundle是否存在
     * @param {string} bundleName - bundle包名
     * @returns {boolean} 
     */
    hasBundle(bundleName: string): boolean {
        return this._packages[bundleName] !== undefined;
    }

    /**
     * @method loadPackage
     * @description 加载包
     * @param {string} bundleName - bundle包名
     * @param {string} packageName - 包含的包名
     * @returns {Promise<void>} 
     */
    async loadPackage(bundleName: string, packageName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(this.hasPackage(bundleName, packageName)){
                return resolve();
            }
            const load = () => {
                const bundle = assetManager.getBundle(bundleName) as AssetManager.Bundle;
                fgui.UIPackage.loadPackage(bundle, packageName, (error, pkg)=>{
                    if(error){
                        console.log('loadPackage error', error);
                        return reject(error);
                    }

                    this._packages[bundleName].push(packageName);
                    resolve();
                })
            };

            if(this.hasBundle(bundleName)){
                load();
                return;
            }
            assetManager.loadBundle(bundleName, (error, bundle) => {
                if(error){
                    console.log('loadBundle error', error);
                    return reject(error);
                }
                this._packages[bundleName] = this._packages[bundleName] || [];
                load();
            });


        });
    }
}