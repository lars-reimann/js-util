import mocha       from "mocha";

import cloner      from "./cloner.js";
import color       from "./color.js";
import idGenerator from "./idGenerator.js";

mocha.setup("bdd");

cloner();
color();
idGenerator();

mocha.run();