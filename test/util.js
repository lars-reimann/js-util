import mocha       from "mocha";

import cloneable   from "./cloneable.js";
import cloner      from "./cloner.js";
import color       from "./color.js";
import idGenerator from "./idGenerator.js";

mocha.setup("bdd");

cloneable();
cloner();
color();
idGenerator();

mocha.run();