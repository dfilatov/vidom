import sinon from 'sinon';
import { h, createComponent, mountSync, unmountSync } from '../../../src/vidom';
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
                    expect(this.attrs).to.be.eql(nextAttrs);
                    expect(this.children).to.be.equal(nextChildren);
                    expect(this.context).to.be.equal(nextContext);
                    expect(arg1).to.be.eql(prevAttrs);
                    expect(arg2).to.be.equal(prevChildren);
                    expect(arg3).to.be.equal(emptyObj);
                    expect(arg4).to.be.equal(prevContext);
                    done();
                    return true;
                }
            }),
            prevAttrs = { id : 1 },
            nextAttrs = { id : 2 },
            prevChildren = [h('div')],
            nextChildren = [h('span')],
            prevContext = { ctx : 1 },
            nextContext = { ctx : 2 };

        mountSync(domNode, h(C, prevAttrs, prevChildren), prevContext);
        mountSync(domNode, h(C, nextAttrs, nextChildren), nextContext);
    });

    it('shouldn\'t be called if component updates itself', done => {
        const C = createComponent({
            onMount() {
                this.update();
            },

            shouldRerender() {
                done('Unexpected call of shouldRerender');
            },

            onUpdate() {
                done();
            }
        });

        mountSync(domNode, h(C));
    });

    it('should prevent rendering if returns false', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return h('div');
                },

                shouldRerender() {
                    return false;
                }
            });

        mountSync(domNode, h(C));
        mountSync(domNode, h(C));

        expect(spy.calledOnce).to.be.ok();
    });
});
