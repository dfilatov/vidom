import sinon from 'sinon';
import createNode from '../../../lib/createNode';
import createComponent from '../../../lib/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../../lib/client/mounter';

describe('onAttrsReceive', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new attrs is passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return createNode('div');
                },

                onAttrsReceive : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs, oldAttrs)).to.be.ok();
    });

    it('shouldn\'t be called when no new attrs is passed', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender() {
                    return createNode('div');
                },

                onAttrsReceive : spy
            });

        mountToDomSync(domNode, createNode(C));
        mountToDomSync(domNode, createNode(C));

        expect(spy.called).not.to.be.ok();
    });
});
