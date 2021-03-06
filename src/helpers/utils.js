/**
   * log 
   * @param {String} msg - The message to emit to console/log watcher.
   * @param {Number} type - The type of message: 0=msg, 1=warning, 2=error
   */
export function log(msg, type = 0) {
        if(type === 1) {
            console.warn(`[${process.env.appName}] ${msg}`);
        }else if(type === 2) {
            console.error(`[${process.env.appName}] ${msg}`);
        }else {
            console.log(`[${process.env.appName}] ${msg}`);
        }
}
/**
   * loadENV 
   */
export function loadENV() {
    const defaultConfig = dotenv.config({
        path: path.resolve(process.cwd(), '.env.default')
    });
    const config = dotenv.config(); 

    if (config.error && !defaultConfig.error) {
        this.log("Could not find .env file, using default env file..");
    }else if(config.error && defaultConfig.error) {
        this.log("Could not find any .env files, please set one up!", 1);
    }else {
        this.log("Successfully loaded .env variables..");
    }
}