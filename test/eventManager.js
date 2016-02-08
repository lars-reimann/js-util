/* global describe */
/* global it */
import {expect} from "chai";

import {Event, EventManager, observableSymbols} from "@ignavia/util";
const addListener    = observableSymbols.addListener,
      removeListener = observableSymbols.removeListener,
      fireEvent      = observableSymbols.fireEvent;

export default function () {

    /** @test {EventManager} */
    describe("EventManager", function () {

        /** @test {EventManager#addListener} */
        describe("EventManager#addListener", function () {
            it("should add an event listener", function () {
                let r;
                const em = new EventManager(),
                      e  = new Event({source: this, type: "test"});

                em[addListener]((e) => r = e, "test");
                em[fireEvent](e);
                expect(r).to.equal(e);
            });
        });

        /** @test {EventManager#removeListener} */
        describe("EventManager#removeListener", function () {
            it("should remove an event listener completely (no types parameter)", function () {
                let r;
                const em = new EventManager(),
                      e  = new Event({source: this, type: "test"}),
                      l  = (e) => r = e;

                em[addListener](l, "test");
                em[removeListener](l);
                em[fireEvent](e);
                expect(r).to.be.undefined;
            });

            it("should remove an event listener only from specific event types (set types parameter)", function () {
                let r;
                const em = new EventManager(),
                      e  = new Event({source: this, type: "test"}),
                      l  = (e) => r = e;

                em[addListener](l, ["test", "moreTests"]);
                em[removeListener](l, "moreTests");
                em[fireEvent](e);
                expect(r).to.equal(e);
            });

            it("should continue when an event type does no exist", function () {
                const em = new EventManager(),
                      l  = (e) => e;

                em[addListener](l);
                em[removeListener](l, "test");
            });
        });

        describe("EventManager#fireEvent", function () {
           it("should notify all listeners (event without type)", function () {
                let r0, r1, r2;
                const em = new EventManager(),
                      e  = new Event(),
                      l0 = (e) => r0 = e,
                      l1 = (e) => r1 = e,
                      l2 = (e) => r2 = e;

                em[addListener](l0);
                em[addListener](l1, "test1");
                em[addListener](l2, "test2");
                em[fireEvent](e);
                expect(r0).to.equal(e);
                expect(r1).to.equal(e);
                expect(r2).to.equal(e);
           });

           it("should notify all listeners of the specified event type (event with type)", function () {
                let r0, r1, r2;
                const em = new EventManager(),
                      e  = new Event({type: "test2"}),
                      l0 = (e) => r0 = e,
                      l1 = (e) => r1 = e,
                      l2 = (e) => r2 = e;

                em[addListener](l0);
                em[addListener](l1, "test1");
                em[addListener](l2, "test2");
                em[fireEvent](e);
                expect(r0).to.be.undefined;
                expect(r1).to.be.undefined;
                expect(r2).to.equal(e);
           });
        });
    });
}