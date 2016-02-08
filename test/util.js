import mocha       from "mocha";

import cloneable   from "./cloneable.js";
import cloner      from "./cloner.js";
import color       from "./color.js";
import extensible  from "./extensible.js";
import idGenerator from "./idGenerator.js";
import observable  from "./observable.js";

mocha.setup("bdd");

cloneable();
cloner();
color();
extensible();
idGenerator();
observable();

mocha.run();
