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

    it('should be called after a component has updated with actual and previous attributes and children', done => {
        const C = createComponent({
                onUpdate(arg1, arg2, arg3) {
                    expect(this.attrs).to.be.equal(nextAttrs);
                    expect(this.children).to.be.equal(nextChildren);
                    expect(arg1).to.be.equal(prevAttrs);
                    expect(arg2).to.be.equal(prevChildren);
                    expect(arg3).to.be.equal(emptyObj);
                    done();
                }
            }),
            prevAttrs = { id : 1 },
            nextAttrs = { id : 2 },
            prevChildren = [node('div')],
            nextChildren = [node('span')];

        mountSync(domNode, node(C).attrs(prevAttrs).children(prevChildren));
        mountSync(domNode, node(C).attrs(nextAttrs).children(nextChildren));
    });

    it('should not be called if component hasn\'t updated', () => {
        const spy = sinon.spy(),
            C = createComponent({
                shouldUpdate() {
                    return false;
                },

                onUpdate : spy
            });

        mountSync(domNode, node(C).attrs({ id : 1 }));
        mountSync(domNode, node(C).attrs({ id : 2 }));

        expect(spy.called).not.to.be.ok();
    });
});
