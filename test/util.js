export const container = document.getElementById("mocha");

// Setup mocha and chai
import mocha from "mocha";
mocha.setup("bdd");

// Setup test cases
import cloner from "./cloner.js";
cloner();

import idGenerator from "./idGenerator.js";
idGenerator();

// Run tests
mocha.run();
