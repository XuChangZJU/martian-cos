/**
 * Created by lavystord on 16/9/10.
 */
function upload(file, params, formInput={}) {
    //url 如果有传入的话 就是文件的完整路径 没有就由外部自己拼成
    const { url, key, uploadToken, uploadHost } = params;


    let formData = new FormData();

    formData.append('key',key);

    for (let k in formInput) {
        formData.append(k, formInput[k]);
    }

    if (!formInput.file) formData.append('file', file); //web 传入文件
    if (!formInput.token) formData.append('token', uploadToken);

    let options = {};
    options.body = formData;
    options.method = 'POST';
    return fetch(uploadHost, options).then(
        (response) => response.json(),
        (err) => {
            return Promise.reject(err);
        }
    ).then(
        (json) => {
            if (!json.key || json.error !== undefined) {
                return Promise.reject(json)
            }
            else {
                return Promise.resolve({
                    url:url
                });
            }
        }
    );


}


module.exports = {
    upload
};
