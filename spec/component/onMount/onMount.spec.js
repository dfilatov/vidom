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
                    return node('div').setChildren(
                        node('fragment').setChildren(
                            node(C2).setChildren(node(C3))));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                onRender() {
                    return node('div').setChildren(this.children);
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

    it('should be called with actual attributes', done => {
        const C1 = createComponent({
                onMount() {
                    expect(this.attrs).to.be.equal(attrs);
                    done();
                }
            }),
            attrs = { name : 'value' };

        mountSync(domNode, node(C1).setAttrs(attrs));
    });

    it('should be recursively called when existing dom is adopted', () => {
        const spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            C1 = createComponent({
                onMount : spy1,
                onRender() {
                    return node('div').setChildren(node(C2));
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
