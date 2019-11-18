import {resolve} from "path";

import {config} from "dotenv";

config({path: resolve(__dirname, `../${process.argv[2]}.env`)});
