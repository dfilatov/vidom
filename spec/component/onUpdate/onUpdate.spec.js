import sinon from 'sinon';
import createNode from '../../../lib/createNode';
import createComponent from '../../../lib/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../../lib/client/mounter';

describe('onUpdate', () => {
    var domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called after a component is updated with actual attributes', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender(attrs) {
                    return createNode('div').attrs(attrs);
                },

                onUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs)).to.be.ok();
    });

    it.skip('should not be called if component isn\'t updated', () => {
        const spy = sinon.spy(),
            C = createComponent({
                onRender(attrs) {
                    return createNode('div').attrs(attrs);
                },

                onUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 1 };

        mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).not.to.be.ok();
    });
});
