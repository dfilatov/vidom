import sinon from 'sinon';
import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../../src/client/mounter';

describe('onMount', () => {
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
                onMount : spy1,
                onRender() {
                    return createNode('div').children(createNode(C2).children(createNode(C3)));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                onRender(_, content) {
                    return createNode('div').children(content);
                }
            }),
            C3 = createComponent({
                onMount : spy3,
                onRender() {
                    return createNode('div');
                }
            });

        mountToDomSync(domNode, createNode(C1));

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

        mountToDomSync(domNode, createNode(C1).attrs(attrs));

        expect(spy.calledWith(attrs)).to.be.ok();
    });

    it('should be recursively called when existing dom is adopted', () => {
        const spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            C1 = createComponent({
                onMount : spy1,
                onRender() {
                    return createNode('div').children(createNode(C2));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                onRender() {
                    return createNode('div');
                }
            });

        domNode.innerHTML = '<div><div></div></div>'
        mountToDomSync(domNode, createNode(C1));

        expect(spy1.called).to.be.ok();
        expect(spy2.called).to.be.ok();
    });

    it('should be called on component replacing', () => {
        const spy = sinon.spy(),
            C1 = createComponent(),
            C2 = createComponent({
                onMount : spy
            });

        mountToDomSync(domNode, createNode(C1));
        mountToDomSync(domNode, createNode(C2));

        expect(spy.called).to.be.ok();
    });

    it('should be called if node replaced with component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return createNode('div');
                },

                onMount : spy
            });

        mountToDomSync(domNode, createNode('div'));
        mountToDomSync(domNode, createNode(C));

        expect(spy.called).to.be.ok();
    });

    it('should be called if function component replaced with component', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return createNode('div');
                },

                onMount : spy
            });

        mountToDomSync(domNode, createNode(() => createNode('div')));
        mountToDomSync(domNode, createNode(C));

        expect(spy.called).to.be.ok();
    });
});
