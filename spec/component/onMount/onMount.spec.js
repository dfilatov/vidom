import sinon from 'sinon';
import { elem, createComponent, mountSync, unmountSync } from '../../../src/vidom';

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
                    return elem('div').setChildren(
                        elem('fragment').setChildren(
                            elem(C2).setChildren(elem(C3))));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                onRender() {
                    return elem('div').setChildren(this.children);
                }
            }),
            C3 = createComponent({
                onMount : spy3,
                onRender() {
                    return elem('div');
                }
            });

        mountSync(domNode, elem(C1));

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

        mountSync(domNode, elem(C1).setAttrs(attrs));
    });

    it('should be recursively called when existing dom is adopted', () => {
        const spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            C1 = createComponent({
                onMount : spy1,
                onRender() {
                    return elem('div').setChildren(elem(C2));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                onRender() {
                    return elem('div');
                }
            });

        domNode.innerHTML = '<div><div></div></div>';
        mountSync(domNode, elem(C1));

        expect(spy1.called).to.be.ok();
        expect(spy2.called).to.be.ok();
    });

    it('should be called on component replacing', () => {
        const spy = sinon.spy(),
            C1 = createComponent(),
            C2 = createComponent({
                onMount : spy
            });

        mountSync(domNode, elem(C1));
        mountSync(domNode, elem(C2));

        expect(spy.called).to.be.ok();
    });

    it('should be called if node replaced with component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return elem('div');
                },

                onMount : spy
            });

        mountSync(domNode, elem('div'));
        mountSync(domNode, elem(C));

        expect(spy.called).to.be.ok();
    });

    it('should be called if function component replaced with component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return elem('div');
                },

                onMount : spy
            });

        mountSync(domNode, elem(() => elem('div')));
        mountSync(domNode, elem(C));

        expect(spy.called).to.be.ok();
    });
});
