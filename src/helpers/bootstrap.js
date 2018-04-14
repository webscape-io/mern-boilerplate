// =====================
// Custom Imports
// ---------------
import * as utils from "./utils";

// =====================
// Node Imports
// ---------------
import path from "path";

// =====================
// 3rd Party Imports
// ---------------
import dotenv from "dotenv";
import rp from "request-promise";
import cheerio from "cheerio";
import jsonfile from "jsonfile";
import _ from "lodash";
 

// =====================
// Globals
// ---------------
global.utils = utils;

global.path = path;

global.dotenv = dotenv;
global.jsonfile = jsonfile;
global._ = _;
global.rp = rp; 
global.cheerio = cheerio; 

// =====================
// Bootstrapping
// ---------------
utils.loadENV();