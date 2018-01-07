import sinon from 'sinon';
import { elem, createComponent, mountSync, unmountSync } from '../../../src/vidom';
import emptyObj from '../../../src/utils/emptyObj';

describe('shouldRerender', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called before rerender with proper arguments', done => {
        const C = createComponent({
                shouldRerender(arg1, arg2, arg3, arg4) {
                    expect(this.attrs).to.be.equal(nextAttrs);
                    expect(this.children).to.be.equal(nextChildren);
                    expect(this.context).to.be.equal(nextContext);
                    expect(arg1).to.be.equal(prevAttrs);
                    expect(arg2).to.be.equal(prevChildren);
                    expect(arg3).to.be.equal(emptyObj);
                    expect(arg4).to.be.equal(prevContext);
                    done();
                    return true;
                }
            }),
            prevAttrs = { id : 1 },
            nextAttrs = { id : 2 },
            prevChildren = [elem('div')],
            nextChildren = [elem('span')],
            prevContext = { ctx : 1 },
            nextContext = { ctx : 2 };

        mountSync(domNode, elem(C).setAttrs(prevAttrs).setChildren(prevChildren), prevContext);
        mountSync(domNode, elem(C).setAttrs(nextAttrs).setChildren(nextChildren), nextContext);
    });

    it('should prevent rendering if returns false', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return elem('div');
                },

                shouldRerender() {
                    return false;
                }
            });

        mountSync(domNode, elem(C));
        mountSync(domNode, elem(C));

        expect(spy.calledOnce).to.be.ok();
    });
});
