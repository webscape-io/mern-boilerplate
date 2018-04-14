export default class Page {

    constructor(options) {
        this.options = options;
    }

/**
   * parseEmployeePage
   * 
   * @param {Array|Objects} workers - Array of workers to add the individual to.
   * @param {Object} options - An object of website information.
   * @param {Object|String} host - Domain base (http://website.com, website or website.com).
   * @param {Object|String} uri - Absolute endpoint, (http://website.com/our-team).
   * @param {Object|String} filepath - Where to store the files.
   * @param {Object|Boolean} write - Enable/diasble write to json.
   * @param {Object|Boolean} exitOnError - Enable/disable exit on error when iterating employee directories.
   * @returns {Array|Object} - An array of employee objects or an empty array.
   */
    parseEmployeePage() { 
        let workers = [];
        let options = _.merge({
            transform: function (body) {
                return cheerio.load(body);
            }
        }, this.options);
          
        return rp(options).then(($) => {
            let promises = []; 
            let request = null;
            
            $('#form-search-results li').each((i, elem) => { 
                promises.push(this.parseIndividual($, options, elem)); 
            });  
    
            return Promise.all(promises); 
    
        }).catch((err) => {
            utils.log(err, 2);
            return null;
        });
    
    }
    

/**
   * parseEmployeePage
   * 
   * @param {Object} $ - Cheerio-style jQuery.
   * @param {Object} options - An array of options for the employee search.
   * @param {Cheerio DOMNode} elem - A Cheerio-style DOM node.
   */ 
    parseIndividual($, options, elem) {
        return new Promise((resolve, reject) => {
            let worker = false;

            if(!$(elem).find($('.title')).text().length > 0) {
                resolve(worker);
            }

            try {

                worker = { 
                    name: $(elem).find($('.title')).text() || null,
                    title: $(elem).find($('.position')).text() || null,
                    picture: $(elem).find($('.photo img')).attr('src') || null, 
                    phone: $(elem).find($('.phone')).text() || null,
                    email: $(elem).find($('.email a')).attr('href') || null, 
                    bio: $(elem).find($('.title a')).attr('href') || null,
                    date: Date.now(),
                    sourceURL: options.uri
                }  

                if(worker.email) {
                    worker.email = worker.email.replace('mailto:', ''); 
                }

                if(worker.bio) {
                    rp({ 
                        host: "gsblaw.com/",
                        uri: "http://www.gsblaw.com/#"+worker.bio,
                        transform: function (body) {
                            return cheerio.load(body);
                        }
                    }).then(($) => {  
                        worker.bioText = $.text(); 
                        resolve(worker);
                    });
                }else {  
                    resolve(worker);
                }

            }catch(err) { 
                utils.log({err}, 2);

                if(options.exitOnError)  
                    reject(err);
            }

    })
}
}