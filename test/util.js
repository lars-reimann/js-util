import mocha       from "mocha";

import cloner      from "./cloner.js";
import idGenerator from "./idGenerator.js";

mocha.setup("bdd");

cloner();
idGenerator();

mocha.run();