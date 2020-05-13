let id = 0;
startUpload = function (uploadType, files) { // uploadType 区分是控件还是 flash 
    for (let i = 0, file; file = files[i++];) {
        const uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
        uploadObj.init(id++); // 给 upload 对象设置一个唯一的 id 
    }
};

class Upload {
    constructor(uploadType) {
        this.uploadType = uploadType;
    }
    delFile() {
        if (this.fileSize < 3000)
            return this.dom.parentNode.removeChild(this.dom);

        if (window.confirm('确定要删除该文件吗? ' + this.fileName))
            return this.dom.parentNode.removeChild(this.dom);

    }
}

const UploadFactory = (function() {
    const store = {};
    return {
        create(uploadType) {
            if(store(uploadType)) {
                return store(uploadType);
            }
            return store(uploadType) = new Upload(uploadType);
        },
    }
}());

const uploadManager = (function() {
    const uploadDatabase = {}; // 存储外部状态

    return {
        add(id, uploadType, fileName, fileSize) {
            const uploadObj = UploadFactory(uploadType);

            const dom = document.createElement('div');
            dom.innerHTML = `
                <span>文件名：${fileName} 文件大小：${fileSize}</span>
                <button class="delFile">删除</button>
            `;
            dom.querySelector('.delFile').onclick = () => {
                uploadObj.delFile();
            }
            document.body.append(dom);
            uploadDatabase[id] = {
                fileName,
                fileSize,
                dom,
            }
            return uploadObj;
        },
        setExternalState(id, ) {

        }
    }
}());

const pluginFiles = [
    {
        fileName: '1.txt',
        fileSize: 1000
    },
    {
        fileName: '2.html',
        fileSize: 3000
    },
    {
        fileName: '3.txt',
        fileSize: 5000
    }
];

const flashFiles = [
    {
        fileName: '4.txt',
        fileSize: 1000
    },
    {
        fileName: '5.html',
        fileSize: 3000
    },
    {
        fileName: '6.txt',
        fileSize: 5000
    }
]

startUpload('plugin', pluginFiles);
startUpload('flash', flashFiles);