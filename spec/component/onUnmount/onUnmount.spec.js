import sinon from 'sinon';
import { node, createComponent, mountToDomSync, unmountFromDomSync } from '../../../src/vidom';

describe('onUnmount', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
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

        mountToDomSync(domNode, node(C1));
        unmountFromDomSync(domNode);

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

        mountToDomSync(domNode, node(C1));
        mountToDomSync(domNode, node(C2));

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

        mountToDomSync(domNode, node(C));
        mountToDomSync(domNode, node('div'));

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

        mountToDomSync(domNode, node(C));
        mountToDomSync(domNode, node(() => node('div')));

        expect(spy.called).to.be.ok();
    });
});
