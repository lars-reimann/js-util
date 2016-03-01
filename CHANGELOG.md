# Changelog

## 1.1.7 (2016-02-11)

Added extended mixins to the Cloneable, Extensible and Observable modules. Those mixins offer an easier way for clients to work with the added methods because the property keys are names and not symbols. For example, it is now possible to clone an object by calling the `clone` method instead of having to use `[cloneableSymbols.clone]`. The methods with the symbol keys are also included, so you don't need to use both mixins.