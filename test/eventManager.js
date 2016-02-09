/* global describe */
/* global it */
import chai, {expect} from "chai";
import chaiSinon      from "sinon-chai";
chai.use(chaiSinon);

import sinon from "sinon";

import {Event, EventManager, observableSymbols} from "@ignavia/util";
const addListener    = observableSymbols.addListener,
      removeListener = observableSymbols.removeListener,
      fireEvent      = observableSymbols.fireEvent;

export default function () {

    /** @test {EventManager} */
    describe("EventManager", function () {

        /** @test {EventManager#addListener} */
        describe("#addListener", function () {
            it("should add an event listener", function () {
                const em  = new EventManager(),
                      e   = new Event({type: "test"}),
                      spy = sinon.spy();

                em[addListener](spy, "test");
                em[fireEvent](e);
                expect(spy).to.have.been.calledOnce;
                expect(spy).to.have.been.calledWith(e);
            });
        });

        /** @test {EventManager#removeListener} */
        describe("#removeListener", function () {
            it("should remove an event listener completely (no types parameter)", function () {
                const em  = new EventManager(),
                      e   = new Event({type: "test"}),
                      spy = sinon.spy();

                em[addListener](spy, "test");
                em[removeListener](spy);
                em[fireEvent](e);
                expect(spy).to.not.have.been.called;
            });

            it("should remove an event listener only from specific event types (set types parameter)", function () {
                const em  = new EventManager(),
                      e0  = new Event({type: "test"}),
                      e1  = new Event({type: "moreTests"}),
                      spy = sinon.spy();

                em[addListener](spy, ["test", "moreTests"]);
                em[removeListener](spy, "moreTests");
                em[fireEvent](e0);
                expect(spy).to.have.been.calledOnce;
                expect(spy).to.have.been.calledWith(e0);

                spy.reset();

                em[fireEvent](e1);
                expect(spy).to.not.have.been.called;
            });

            it("should continue when an event type does no exist", function () {
                const em = new EventManager(),
                      l  = () => true;

                em[addListener](l);
                em[removeListener](l, "test");
            });
        });

        describe("#fireEvent", function () {
            it("should notify all listeners (event without type)", function () {
                const em   = new EventManager(),
                      e    = new Event(),
                      spy0 = sinon.spy(),
                      spy1 = sinon.spy(),
                      spy2 = sinon.spy();

                em[addListener](spy0);
                em[addListener](spy1, "test1");
                em[addListener](spy2, "test2");
                em[fireEvent](e);
                expect(spy0).to.have.been.calledOnce;
                expect(spy0).to.have.been.calledWith(e);
                expect(spy1).to.have.been.calledOnce;
                expect(spy1).to.have.been.calledWith(e);
                expect(spy2).to.have.been.calledOnce;
                expect(spy2).to.have.been.calledWith(e);
            });

            it("should notify all listeners of the specified event type (event with type)", function () {
                const em   = new EventManager(),
                      e    = new Event({type: "test2"}),
                      spy0 = sinon.spy(),
                      spy1 = sinon.spy(),
                      spy2 = sinon.spy();

                em[addListener](spy0);
                em[addListener](spy1, "test1");
                em[addListener](spy2, "test2");
                em[fireEvent](e);
                expect(spy0).to.not.have.been.called;
                expect(spy1).to.not.have.been.called;
                expect(spy2).to.have.been.calledOnce;
                expect(spy2).to.have.been.calledWith(e);
            });
        });
    });
}
