/**
 * Created by Administrator on 2016/5/4.
 */
"use strict";

const urlM = require('url');

// todo 整个函数签名改变,详情见对应的native文件
function upload(file, url, sign, bizAttr, type) {
    var formData;
    if(typeof file === "object" &&  typeof file.uri === "string") {
        formData = new FormData();
        formData.append("op", "upload");
        let type, name, fileSuffix, index1 = file.uri.lastIndexOf('/'), index2 = file.uri.lastIndexOf('.');
        name = ( index1 === -1) ? file.uri : file.uri.slice(index1 + 1);
        fileSuffix = (index2 === -1) ? file.uri : file.uri.slice(index2 + 1);
        switch(fileSuffix)  {
            case "jpg":
            case "jpeg": {
                type = "image/jpeg";
                break;
            }
            case "png": {
                type = "image/png";
                break;
            }
            case "gif":
            {
                type = "image/gif";
                break;
            }
            default:
            {
                type = 'application/octet-stream';
                break;
            }
        }


        const fileContent = {
            uri: file.uri,
            type,
            name
        }
        formData.append("filecontent", fileContent);
        if(bizAttr) {
            switch(typeof bizAttr) {
                case "object": {
                    bizAttr = JSON.stringify(bizAttr);
                    break;
                }
                case "string":
                    break;
                default:
                    throw new Error("bizAttr仅支持对象和字符串类型");
                    return;
            }
            formData.append("biz_attr", bizAttr);
        }
    }
    else {
        throw  new Error("尚不支持的file参数类型");
    }

    var promise = new Promise(function(resolve, reject) {

        var urlInfo = urlM.parse(url);
        var headers = {
            "Authorization": sign,
            "Host": "web.file.myqcloud.com"
        };

        var init = {
            headers: headers,
            body: formData,
            method: 'POST',
            hostname: urlInfo.hostname
        };

        fetch(url, init)
            .then((response) => {
                    response.json()
                        .then(
                            (json) => {
                                if (!response.ok || json.error != undefined) {
                                    reject(json)
                                }
                                else {
                                    resolve({
                                        url: json.data.access_url
                                    });
                                }
                            }
                        )
                },
                (err) => {
                    reject(err);
                }
            );
    });

    return promise;
}




module.exports = {
    upload
};

