declare const moddleOptions: {
    name: string;
    uri: string;
    prefix: string;
    xml: {
        tagAlias: string;
    };
    types: ({
        name: string;
        isAbstract: boolean;
        extends: string[];
        properties: {
            name: string;
            isAttr: boolean;
            type: string;
        }[];
        superClass?: undefined;
    } | {
        name: string;
        superClass: string[];
        isAbstract?: undefined;
        extends?: undefined;
        properties?: undefined;
    })[];
};
export { moddleOptions };
