# Changelog

## 2.0.0 (2016-06-27)

* Strings with dots are no longer split automatically when converting them to GumpPaths.

## 1.4.0 (2016-06-24)

* Added a method to avoid specific IDs to IDGenerator. The `increaseToAtLeast` method is now deprecated.

## 1.3.0 (2016-04-19)

* Added a way to set the counter to the IDGenerator. This can be used to skip some IDs that might be used already.
* Added a method to get the top-level keys of a GumpMap.
* Added an option to GumpMaps to automatically delete containers once the become empty.

## 1.2.0 (2016-03-30)

* Added the classes GumpMap, GumpSet and GumpPath. Those make it easy to structure data hierarchically by providing access to nested values from the top level container.
* Building on that the classes Tolkien1To1Map, Tolkien1ToNMap and TolkienMToNMap can be used to express relations between entities.
* Added a wrapper for iterables, iterators and generator functions providing combinators.

## 1.1.7 (2016-02-11)

* Added extended mixins to the Cloneable, Extensible and Observable modules. Those mixins offer an easier way for clients to work with the added methods because the property keys are names and not symbols. For example, it is now possible to clone an object by calling the `clone` method instead of having to use `[cloneableSymbols.clone]`. The methods with the symbol keys are also included, so you don't need to use both mixins.