'use strict';

/**
 * Created by lavystord on 16/9/10.
 */
function upload(file, params) {
    var formInput = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    //url 如果有传入的话 就是文件的完整路径 没有就由外部自己拼成
    var url = params.url;
    var key = params.key;
    var uploadToken = params.uploadToken;
    var uploadHost = params.uploadHost;


    var formData = new FormData();

    formData.append('key', key);

    for (var k in formInput) {
        formData.append(k, formInput[k]);
    }

    if (!formInput.file) formData.append('file', file); //web 传入文件
    if (!formInput.token) formData.append('token', uploadToken);

    var options = {};
    options.body = formData;
    options.method = 'POST';
    return fetch(uploadHost, options).then(function (response) {
        return response.json();
    }, function (err) {
        return Promise.reject(err);
    }).then(function (json) {
        if (!json.key || json.error !== undefined) {
            return Promise.reject(json);
        } else {
            return Promise.resolve({
                url: url
            });
        }
    });
}

module.exports = {
    upload: upload
};