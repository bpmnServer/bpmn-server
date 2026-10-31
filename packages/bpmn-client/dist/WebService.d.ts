declare class WebService {
    statusCode: any;
    result: any;
    response: any;
    constructor();
    invoke(params: any, options: any, postData?: any): Promise<any>;
    /** The message of a failed call: the server's own when it sent one. */
    static toError(err: any): Error;
    /**
     * Servers report failures in the body of a 200 answer as { errors } or { error } (bpmn-web's
     * routes use both); an HTML page instead of JSON means the request did not reach the API.
     */
    static checkResult(data: any): any;
    upload(fileName: any, path: any, path2: any, options: any): Promise<any>;
}
export { WebService };
