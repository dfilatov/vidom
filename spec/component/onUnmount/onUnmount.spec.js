import sinon from 'sinon';
import { elem, createComponent, mountSync, unmountSync } from '../../../src/vidom';

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
                    return elem('div').setChildren(
                        elem('fragment').setChildren(
                            elem(C2).setChildren(elem(C3))));
                }
            }),
            C2 = createComponent({
                onUnmount : spy2,
                onRender() {
                    return elem('div').setChildren(this.children);
                }
            }),
            C3 = createComponent({
                onUnmount : spy3,
                onRender() {
                    return elem('div');
                }
            });

        mountSync(domNode, elem(C1));
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

        mountSync(domNode, elem(C1));
        mountSync(domNode, elem(C2));

        expect(spy.called).to.be.ok();
    });

    it('should be called if component replaced with node', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return elem('div');
                },

                onUnmount : spy
            });

        mountSync(domNode, elem(C));
        mountSync(domNode, elem('div'));

        expect(spy.called).to.be.ok();
    });

    it('should be called if component replaced with function component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return elem('div');
                },

                onUnmount : spy
            });

        mountSync(domNode, elem(C));
        mountSync(domNode, elem(() => elem('div')));

        expect(spy.called).to.be.ok();
    });
});
