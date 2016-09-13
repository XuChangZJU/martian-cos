/**
 * Created by lavystord on 16/9/10.
 */
const foo = '!!!!!!!!!!!!!!!!!!!!!!!';
function upload(file, params, formInput={}) {

    const { url, key, uploadToken, uploadHost } = params;

    // if (typeof formInput !== 'object') {
    //     return false;
    // }

    let formData = new FormData();

    formData.append('key',key);

    for (let k in formInput) {
        formData.append(k, formInput[k]);
    }

    if (!formInput.file) formData.append('file', {uri: file.uri, type: 'application/octet-stream'});
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
