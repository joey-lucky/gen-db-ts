import {Command} from "commander";
import {generateDbType} from "./genrate";
const program = new Command();
program.version("0.0.1");

generateDbType();