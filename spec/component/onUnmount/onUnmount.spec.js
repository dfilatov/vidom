import sinon from 'sinon';
import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

describe('onUnmount', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be recursively called', () => {
        const spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            spy3 = sinon.spy(),
            C1 = createComponent({
                onUnmount : spy1,
                onRender() {
                    return h('div', { children : h('fragment', { children : h(C2, { children : h(C3) }) }) });
                }
            }),
            C2 = createComponent({
                onUnmount : spy2,
                onRender() {
                    return h('div', { children : this.children });
                }
            }),
            C3 = createComponent({
                onUnmount : spy3,
                onRender() {
                    return h('div');
                }
            });

        mountSync(domNode, h(C1));
        unmountSync(domNode);

        expect(spy1.called).to.be.ok();
        expect(spy2.called).to.be.ok();
        expect(spy3.called).to.be.ok();
    });

    it('should be called on component replacing', () => {
        const spy = sinon.spy(),
            C1 = createComponent({
                onUnmount : spy
            }),
            C2 = createComponent();

        mountSync(domNode, h(C1));
        mountSync(domNode, h(C2));

        expect(spy.called).to.be.ok();
    });

    it('should be called if component replaced with node', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return h('div');
                },

                onUnmount : spy
            });

        mountSync(domNode, h(C));
        mountSync(domNode, h('div'));

        expect(spy.called).to.be.ok();
    });

    it('should be called if component replaced with function component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return h('div');
                },

                onUnmount : spy
            });

        mountSync(domNode, h(C));
        mountSync(domNode, h(() => h('div')));

        expect(spy.called).to.be.ok();
    });
});
