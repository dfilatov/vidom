import sinon from 'sinon';
import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

describe('onUpdate', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called on outer update', done => {
        const prevAttrs = { id : 1 },
            newAttrs = { id : 2 },
            prevChildren = [h('div')],
            nextChildren = [h('span')],
            prevContext = { ctx : 1 },
            nextContext = { ctx : 2 },
            state = { val : 1 },
            C = createComponent({
                onInit() {
                    this.setState(state);
                },

                onUpdate(_prevAttrs, _prevChildren, _prevState, _prevContext) {
                    expect(this.attrs).to.be.eql(newAttrs);
                    expect(_prevAttrs).to.be.eql(prevAttrs);
                    expect(this.children).to.be.equal(nextChildren);
                    expect(_prevChildren).to.be.equal(prevChildren);
                    expect(this.state).to.be.eql(state);
                    expect(_prevState).to.be.eql(state);
                    expect(this.context).to.be.equal(nextContext);
                    expect(_prevContext).to.be.equal(_prevContext);
                    done();
                }
            });

        mountSync(domNode, h(C, { ...prevAttrs, children : prevChildren }), prevContext);
        mountSync(domNode, h(C, { ...newAttrs, children : nextChildren }), nextContext);
    });

    it('should be called if component updates itself', done => {
        const prevState = { val : 1 },
            nextState = { val : 2 },
            C = createComponent({
                onInit() {
                    this.setState(prevState);
                },

                onUpdate(_prevAttrs, _prevChildren, _prevState) {
                    expect(this.state).to.be.eql(nextState);
                    expect(_prevState).to.be.eql(prevState);
                    done();
                },

                onMount() {
                    this.setState(nextState);
                }
            });

        mountSync(domNode, h(C));
    });

    it('shouldn\'t cause additional render if calls update()', done => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    spy();
                    return h('div');
                },

                onUpdate() {
                    this.update();
                },

                onMount() {
                    this.update();
                },

                onReconcile() {
                    expect(spy.calledTwice).to.be.ok();
                    done();
                }
            });

        mountSync(domNode, h(C));
        mountSync(domNode, h(C, {}));
    });
});
