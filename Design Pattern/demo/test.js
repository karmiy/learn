const getActiveUploadObj = function() {
    try {
        return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
    } catch (e) {
        return false;
    }
};

const getFlashUploadObj = function() {
    if (supportFlash()) { // supportFlash 函数未提供
        const str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return false;
};

const getFormUpladObj = function() {
    const str = '<input name="file" type="file" class="ui-file"/>'; // 表单上传
    return $(str).appendTo($('body'));
};

const getUploadObj = getActiveUploadObj.after(getFlashUploadObj).after(getFormUpladObj);

getUploadObj();