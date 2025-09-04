import FairyEditor = CS.FairyEditor;
import CodeWriter from './CodeWriter';

function genCode(handler: FairyEditor.PublishHandler) {
    let settings = (<FairyEditor.GlobalPublishSettings>handler.project.GetSettings("Publish")).codeGeneration;
    let codePkgName = handler.ToFilename(handler.pkg.name); //convert chinese to pinyin, remove special chars etc.
    let exportCodePath = handler.exportCodePath + '/' + codePkgName;
    let namespaceName = codePkgName;
    let ns = "fgui";
    let isThree = handler.project.type == FairyEditor.ProjectType.ThreeJS;

    if (settings.packageName)
        namespaceName = settings.packageName + '.' + namespaceName;

    //CollectClasses(stripeMemeber, stripeClass, fguiNamespace)
    let classes = handler.CollectClasses(settings.ignoreNoname, settings.ignoreNoname, ns);
    handler.SetupCodeFolder(exportCodePath, "ts"); //check if target folder exists, and delete old files

    let getMemberByName = settings.getMemberByName;

    let classCnt = classes.Count;
    let writer = new CodeWriter({ blockFromNewLine: false, usingTabs: true });
    isThree = true
    for (let i: number = 0; i < classCnt; i++) {
        let classInfo = classes.get_Item(i);
        let members = classInfo.members;
        let references = classInfo.references;
        writer.reset();
        writer.writeln('import { assetManager, AssetManager } from "cc";');
        let refCount = references.Count;
        if (isThree) {
            writer.writeln('import * as fgui from "fairygui-cc";');
            if (refCount == 0)
                writer.writeln();
        }

        if (refCount > 0) {
            for (let j: number = 0; j < refCount; j++) {
                let ref = references.get_Item(j);
                writer.writeln('import %s from "./%s";', ref, ref);
                //writer.writeln('fgui.UIObjectFactory.setExtension(%s.URL, %s);', ref, ref);
            }
            writer.writeln();
        }

        writer.writeln('export default class %s extends %s', classInfo.className, classInfo.superClassName);
        writer.startBlock();
        writer.writeln();

        let memberCnt = members.Count;
        for (let j: number = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);
            writer.writeln('public %s:%s;', memberInfo.varName, memberInfo.type);
        }
        writer.writeln('public static URL:string = "ui://%s%s";', handler.pkg.id, classInfo.resId);
        writer.writeln();

        writer.writeln('public static packageName:string = "%s";', codePkgName)
        writer.writeln();

        writer.writeln('public static instance:any | null = null;')
        writer.writeln();

        writer.writeln('public static showView(params?:any):void', classInfo.className);
        writer.startBlock();
        writer.writeln('if(%s.instance)',classInfo.className);
        writer.startBlock();
        writer.writeln('console.log("allready show");');
        writer.writeln('return;');
        writer.endBlock();
        writer.writeln('const bundle = assetManager.getBundle("fgui") as AssetManager.Bundle;');
        writer.writeln('fgui.UIPackage.loadPackage(bundle, this.packageName, (error, pkg)=>');
        writer.startBlock();
        writer.writeln();
        writer.writeln('if(error){console.log("loadPackage error", error);return;}');
        writer.writeln('const view = %s.UIPackage.createObject("%s", "%s");', ns, handler.pkg.name, classInfo.resName);
        writer.writeln();
        writer.writeln('view.makeFullScreen();');
        writer.writeln('%s.instance = view;', classInfo.className);
        writer.writeln('fgui.GRoot.inst.addChild(view);');
        writer.writeln('view.show && view.show(params);');
        writer.endBlock();
        writer.writeln(');');
        writer.endBlock();
        writer.writeln();

        writer.writeln('public static hideView():void');
        writer.startBlock();
        writer.writeln('%s.instance && %s.instance.dispose();', classInfo.className);
        writer.endBlock();

        writer.writeln('public static createInstance():%s', classInfo.className);
        writer.startBlock();
        writer.writeln('return <%s>(%s.UIPackage.createObject("%s", "%s"));', classInfo.className, ns, handler.pkg.name, classInfo.resName);
        writer.endBlock();
        writer.writeln();

        writer.writeln('protected onConstruct():void');
        writer.startBlock();
        for (let j: number = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);
            if (memberInfo.group == 0) {
                if (getMemberByName)
                    writer.writeln('this.%s = <%s>(this.getChild("%s"));', memberInfo.varName, memberInfo.type, memberInfo.name);
                else
                    writer.writeln('this.%s = <%s>(this.getChildAt(%s));', memberInfo.varName, memberInfo.type, memberInfo.index);
            }
            else if (memberInfo.group == 1) {
                if (getMemberByName)
                    writer.writeln('this.%s = this.getController("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.getControllerAt(%s);', memberInfo.varName, memberInfo.index);
            }
            else {
                if (getMemberByName)
                    writer.writeln('this.%s = this.getTransition("%s");', memberInfo.varName, memberInfo.name);
                else
                    writer.writeln('this.%s = this.getTransitionAt(%s);', memberInfo.varName, memberInfo.index);
            }

            if(memberInfo.varName.indexOf('UI_BTN_') == 0){
                const newName = memberInfo.varName.split('KW_BTN_')[1]
                if(newName){
                    const newNames = newName.split('_')
                    const newName2 = newNames.map((v1: string) => { let name = v1.toLowerCase(); return `${name[0].toUpperCase()}${name.slice(1)}` }).join('');
                    writer.writeln('this.%s.onClick(this.onBtn%s, this);', memberInfo.varName, newName2);
                }
            }
        }

        writer.endBlock();

        for (let j: number = 0; j < memberCnt; j++) {
            let memberInfo = members.get_Item(j);

            if(memberInfo.varName.indexOf('UI_BTN_') == 0){
                const newName = memberInfo.varName.split('KW_BTN_')[1]
                if(newName){
                    const newNames = newName.split('_')
                    const newName2 = newNames.map((v1: string) => { let name = v1.toLowerCase(); return `${name[0].toUpperCase()}${name.slice(1)}` }).join('');
                    writer.writeln('private onBtn%s():void', newName2);
                }
            }
        }

        writer.endBlock(); //class
        writer.writeln('fgui.UIObjectFactory.setExtension(%s.URL, %s);', classInfo.className, classInfo.className);
        writer.save(exportCodePath + '/' + classInfo.className + '.ts');
    }
}

export { genCode };