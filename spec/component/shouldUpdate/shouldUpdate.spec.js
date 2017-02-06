import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';
import emptyObj from '../../../src/utils/emptyObj';

describe('shouldUpdate', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when attrs and children are changed', done => {
        const C = createComponent({
                shouldUpdate(arg1, arg2, arg3) {
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

    it('should prevent rendering if returns false', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return node('div');
                },

                shouldUpdate() {
                    return false;
                }
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node(C));

        expect(spy.calledOnce).to.be.ok();
    });
});
