import sinon from 'sinon';
import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountToDomSync, unmountFromDomSync } from '../../../src/client/mounter';

describe('onInit', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called on init', () => {
        const spy = sinon.spy(),
            C1 = createComponent({
                onInit : spy
            });

        mountToDomSync(domNode, createNode(C1));

        expect(spy.called).to.be.ok();
    });
});
