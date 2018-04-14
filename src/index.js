// Custom
import utils from "./helpers/utils.js";

// Node
import path from "path";

// 3rd Party
import dotenv from "dotenv";
import rp from "request-promise";
import cheerio from "cheerio";
import jsonfile from "jsonfile";

global.path = path;
global.dotenv = dotenv;

utils.loadENV();
 
const options = {
    host: process.env.host,
    uri: process.env.uri,
    transform: function (body) {
      return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        const filepath = path.resolve(process.cwd(),  'data', decodeURI(options.host))+".json";
        let workers = [];
        let promises = []; 
         
        $('#form-search-results li').each(function(i, elem) {
            promises.push(new Promise((resolve, reject) => {
                if(!$(this).find($('.title')).text().length > 0) {
                    resolve();
                }

                try {

                    workers[i] = { 
                        name: $(this).find($('.title')).text() || null,
                        title: $(this).find($('.position')).text() || null,
                        picture: $(this).find($('.photo img')).attr('src') || null, 
                        phone: $(this).find($('.phone')).text() || null,
                        email: $(this).find($('.email a')).attr('href') || null, 
                        bio: $(this).find($('.title a')).attr('href') || null,
                        date: Date.now(),
                        sourceURL: options.uri
                    }  

                    if(workers[i].email) {
                        workers[i].email = workers[i].email.replace('mailto:', ''); 
                    }

                    if(workers[i].bio) {
                        rp({ 
                            host: "gsblaw.com/",
                            uri: "http://www.gsblaw.com/#"+workers[i].bio,
                            transform: function (body) {
                                return cheerio.load(body);
                            }
                        }).then(($) => {  
                            workers[i].bioText = $.text();
                            resolve();
                        });
                    }else { 
                        resolve();
                    }
    
                }catch(err) {
                    utils.log(err, 2);
                }

                })); 
        }); 

        Promise.all(promises).then(() => { 
            console.log("Promises complete");
            console.log(workers);
            
            jsonfile.writeFileSync(filepath, workers); 
            utils.log(`Found ${workers.length} employees`);
        }); 
 
    })
    .catch(function (err) {
        // REQUEST FAILED: ERROR OF SOME KIND
        utils.log(err, 2);
    });


