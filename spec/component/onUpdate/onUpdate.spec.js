import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';
import emptyObj from '../../../src/utils/emptyObj';

describe('onUpdate', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called after a component has updated with previous attributes, children and context', done => {
        const C = createComponent({
                onUpdate(arg1, arg2, arg3, arg4) {
                    expect(this.attrs).to.be.equal(nextAttrs);
                    expect(this.children).to.be.equal(nextChildren);
                    expect(this.context).to.be.equal(nextContext);
                    expect(arg1).to.be.equal(prevAttrs);
                    expect(arg2).to.be.equal(prevChildren);
                    expect(arg3).to.be.equal(emptyObj);
                    expect(arg4).to.be.equal(prevContext);
                    done();
                }
            }),
            prevAttrs = { id : 1 },
            nextAttrs = { id : 2 },
            prevChildren = [node('div')],
            nextChildren = [node('span')],
            prevContext = { ctx : 1 },
            nextContext = { ctx : 2 };

        mountSync(domNode, node(C).setAttrs(prevAttrs).setChildren(prevChildren), prevContext);
        mountSync(domNode, node(C).setAttrs(nextAttrs).setChildren(nextChildren), nextContext);
    });

    it('should not be called if component hasn\'t updated', () => {
        const spy = sinon.spy(),
            C = createComponent({
                shouldRerender() {
                    return false;
                },

                onUpdate : spy
            });

        mountSync(domNode, node(C).setAttrs({ id : 1 }));
        mountSync(domNode, node(C).setAttrs({ id : 2 }));

        expect(spy.called).not.to.be.ok();
    });
});
