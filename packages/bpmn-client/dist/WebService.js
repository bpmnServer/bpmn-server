import * as fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
class WebService {
    statusCode;
    result;
    response;
    constructor() { }
    async invoke(params, options, postData = null) {
        var data = JSON.stringify(params);
        var url = 'http://' + options.host + ':' + options.port + options.path;
        if (options.port == 443)
            url = 'https://' + options.host + options.path;
        var config = {
            method: options.method,
            url: url,
            headers: options.headers,
            data: data
        };
        try {
            const response = await axios(config);
            this.result = response.data;
            this.statusCode = response.status;
            return WebService.checkResult(response.data);
        }
        catch (err) {
            throw WebService.toError(err);
        }
    }
    /** The message of a failed call: the server's own when it sent one. */
    static toError(err) {
        if (err && err.isServiceError)
            return err;
        const response = err && err.response;
        if (response) {
            const body = response.data;
            const detail = (body && (body.errors || body.error || body.message)) ||
                (typeof body === 'string' && body.trim() ? body.trim().slice(0, 200) : response.statusText);
            const error = new Error(`${response.status} ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
            error.status = response.status;
            error.body = body;
            error.isServiceError = true;
            return error;
        }
        const error = new Error((err && (err.code || err.message)) ? `${err.code ?? ''} ${err.message ?? ''}`.trim() : String(err));
        error.cause = err;
        error.isServiceError = true;
        return error;
    }
    /**
     * Servers report failures in the body of a 200 answer as { errors } or { error } (bpmn-web's
     * routes use both); an HTML page instead of JSON means the request did not reach the API.
     */
    static checkResult(data) {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            // some answers carry errors: [] on success; drop it so no caller mistakes it for a failure
            if (Array.isArray(data.errors) && data.errors.length === 0)
                delete data.errors;
            const failure = data.errors || data.error;
            if (failure) {
                const error = new Error(typeof failure === 'string' ? failure : JSON.stringify(failure));
                error.body = data;
                error.isServiceError = true;
                throw error;
            }
        }
        if (typeof data === 'string' && /^\s*<(!doctype|html)/i.test(data)) {
            const error = new Error('The server answered with a web page instead of the API: check the host, port and path');
            error.isServiceError = true;
            error.isWebPage = true;
            throw error;
        }
        return data;
    }
    async upload(fileName, path, path2, options) {
        const title = fileName;
        var url = 'http://' + options.host + ':' + options.port + options.path;
        if (options.port == 443)
            url = 'https://' + options.host + options.path;
        const form = new FormData();
        form.append('title', title);
        const fileContents = fs.createReadStream(path);
        form.append('file', fileContents);
        if (path2 !== null) {
            const fileContents2 = fs.createReadStream(path2);
            form.append('file', fileContents2);
        }
        try {
            const response = await axios.post(url, form, { headers: options.headers });
            return WebService.checkResult(response.data);
        }
        catch (error) {
            throw WebService.toError(error);
        }
    }
}
export { WebService };
//# sourceMappingURL=WebService.js.map