import sinon from 'sinon';
import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import emptyObj from '../../../src/utils/emptyObj';
import { h } from '../../helpers';

describe('shouldUpdate', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called with proper arguments after outer update', done => {
        const C = createComponent({
                shouldUpdate(arg1, arg2, arg3, arg4) {
                    expect(this.attrs)
                        .to.be.eql(prevAttrs);
                    expect(this.children)
                        .to.be.equal(prevChildren);
                    expect(this.context)
                        .to.be.equal(prevContext);
                    expect(arg1)
                        .to.be.eql(nextAttrs);
                    expect(arg2)
                        .to.be.equal(nextChildren);
                    expect(arg3)
                        .to.be.equal(emptyObj);
                    expect(arg4)
                        .to.be.equal(nextContext);

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

        mountSync(domNode, h(C, { ...prevAttrs, children : prevChildren }), prevContext);
        mountSync(domNode, h(C, { ...nextAttrs, children : nextChildren }), nextContext);
    });

    it('should be called with proper arguments after inner update', done => {
        const C = createComponent({
                onInit() {
                    this.setState(prevState);
                },

                shouldUpdate(arg1, arg2, arg3, arg4) {
                    expect(this.attrs)
                        .to.be.eql(attrs);
                    expect(this.children)
                        .to.be.equal(children);
                    expect(this.state)
                        .to.be.eql(prevState);
                    expect(this.context)
                        .to.be.equal(context);
                    expect(arg1)
                        .to.be.eql(attrs);
                    expect(arg2)
                        .to.be.equal(children);
                    expect(arg3)
                        .to.be.eql(nextState);
                    expect(arg4)
                        .to.be.equal(context);

                    done();
                    return true;
                },

                onMount() {
                    this.setState(nextState);
                }
            }),
            attrs = { id : 1 },
            children = [h('div')],
            context = { ctx : 1 },
            prevState = { val : 1 },
            nextState = { val : 2 };

        mountSync(domNode, h(C, { ...attrs, children : children }), context);
    });

    it('should prevent rendering if returns false', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return h('div');
                },

                shouldUpdate() {
                    return false;
                }
            });

        mountSync(domNode, h(C));
        mountSync(domNode, h(C));

        expect(spy.calledOnce)
            .to.be.ok();
    });
});
