import './helpers/bootstrap';
import { Page } from "./classes/index";

// =====================
// Declarations
// ---------------
let workers = [];
let page = null;

const options = {
    host: process.env.host,
    uri: process.env.uri,
    exitOnError: false,
    write: true,
    filepath: path.resolve(process.cwd(), "data", process.env.host)
};
 
// =====================
// Program Flow
// ---------------
page = new Page(options);

page.parseEmployeePage(workers, options).then((res) => {
    workers = res;

    utils.log(`Found ${workers.length} employees.`);
        
    if(options.write)
        jsonfile.writeFileSync(options.filepath, workers);  
     
});