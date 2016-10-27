import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';

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
                    return node('div').children(
                        node('fragment').children(
                            node(C2).children(node(C3))));
                }
            }),
            C2 = createComponent({
                onUnmount : spy2,
                onRender(_, content) {
                    return node('div').children(content);
                }
            }),
            C3 = createComponent({
                onUnmount : spy3,
                onRender() {
                    return node('div');
                }
            });

        mountSync(domNode, node(C1));
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

        mountSync(domNode, node(C1));
        mountSync(domNode, node(C2));

        expect(spy.called).to.be.ok();
    });

    it('should be called if component replaced with node', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return node('div');
                },

                onUnmount : spy
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node('div'));

        expect(spy.called).to.be.ok();
    });

    it('should be called if component replaced with function component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return node('div');
                },

                onUnmount : spy
            });

        mountSync(domNode, node(C));
        mountSync(domNode, node(() => node('div')));

        expect(spy.called).to.be.ok();
    });
});
