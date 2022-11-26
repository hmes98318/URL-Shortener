export declare class App {
    private app;
    private urlencodedParser;
    private redirectPrefix;
    private newUrlPrefix;
    constructor();
    /**
     * start express framework
     */
    bootloader(): void;
    /**
     * -------------------------------------------
     * Private Methods
     * -------------------------------------------
     */
    private setEnvironment;
    private setHelmet;
    private setEJS;
    private registerRoute;
}
