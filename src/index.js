import utils from "./helpers/utils.js";
import path from "path";
import dotenv from "dotenv";

global.path = path;
global.dotenv = dotenv;

utils.loadENV();

