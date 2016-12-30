import sinon from 'sinon';
import { node, createComponent, mountSync, unmountSync } from '../../../src/vidom';

describe('onMount', () => {
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
                onMount : spy1,
                onRender() {
                    return node('div').children(
                        node('fragment').children(
                            node(C2).children(node(C3))));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                onRender(_, content) {
                    return node('div').children(content);
                }
            }),
            C3 = createComponent({
                onMount : spy3,
                onRender() {
                    return node('div');
                }
            });

        mountSync(domNode, node(C1));

        expect(spy1.called).to.be.ok();
        expect(spy2.called).to.be.ok();
        expect(spy3.called).to.be.ok();
    });

    it('should be called with actual attributes', () => {
        var spy = sinon.spy(),
            C1 = createComponent({
                onMount : spy,
                onRender() {
                    return null;
                }
            }),
            attrs = { name : 'value' };

        mountSync(domNode, node(C1).attrs(attrs));

        expect(spy.calledWith(attrs)).to.be.ok();
    });

    it('should be recursively called when existing dom is adopted', () => {
        const spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            C1 = createComponent({
                onMount : spy1,
                onRender() {
                    return node('div').children(node(C2));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                onRender() {
                    return node('div');
                }
            });

        domNode.innerHTML = '<div><div></div></div>';
        mountSync(domNode, node(C1));

        expect(spy1.called).to.be.ok();
        expect(spy2.called).to.be.ok();
    });

    it('should be called on component replacing', () => {
        const spy = sinon.spy(),
            C1 = createComponent(),
            C2 = createComponent({
                onMount : spy
            });

        mountSync(domNode, node(C1));
        mountSync(domNode, node(C2));

        expect(spy.called).to.be.ok();
    });

    it('should be called if node replaced with component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return node('div');
                },

                onMount : spy
            });

        mountSync(domNode, node('div'));
        mountSync(domNode, node(C));

        expect(spy.called).to.be.ok();
    });

    it('should be called if function component replaced with component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return node('div');
                },

                onMount : spy
            });

        mountSync(domNode, node(() => node('div')));
        mountSync(domNode, node(C));

        expect(spy.called).to.be.ok();
    });
});
