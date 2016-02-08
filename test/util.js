import "core-js"; // TODO remove once no longer needed

import mocha from "mocha";

import cloneable    from "./cloneable.js";
import cloner       from "./cloner.js";
import color        from "./color.js";
import eventManager from "./eventManager.js";
import extensible   from "./extensible.js";
import idGenerator  from "./idGenerator.js";

mocha.setup("bdd");

cloneable();
cloner();
color();
eventManager();
extensible();
idGenerator();

mocha.run();
