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
    host: "gsblaw.com",
    uri: "http://www.gsblaw.com/people-directory#form-search-results",
    transform: function (body) {
      return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        let workers = [];
        const filepath = path.resolve(process.cwd(),  'data', decodeURI(options.host))+".json";
        
        $('#form-search-results li').each(function(i, elem) {

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
 
            }catch(err) {
                utils.log(err, 2);
            }

        });


        jsonfile.writeFileSync(filepath, workers); 
        utils.log(`Found ${workers.length} employees`);
    })
    .catch(function (err) {
        // REQUEST FAILED: ERROR OF SOME KIND
        utils.log(err, 2);
    });


