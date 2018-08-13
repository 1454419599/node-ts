import fs from 'fs';

const walkFile = (pathResolve: string, ext: string) => {
    let files: any = [];
    try {
        files = fs.readdirSync(pathResolve);
    } catch (error) {
        new Error(error);
    }
    
    console.log(files);
    // files.forEach((value, index) => {
    //     console.log(value, fs.statSync(value).isDirectory());
    // })
    let fileList:any = {};
    for (const item of files) {
        // console.log(i, item);
        let itemArr = item.split('\.');
        let itemExt = (itemArr.length > 1) ? itemArr[(itemArr.length - 1)] : "undefind";
        // console.log(itemExt);
        if (ext === itemExt) {
            fileList[item] = pathResolve + item;
        }
    }
    // console.log(fileList);
    return fileList;
}
// walkFile(__dirname, 'js');
export default walkFile;