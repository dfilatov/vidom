import sinon from 'sinon';
import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountSync, unmountSync } from '../../../src/client/mounter';

describe('onInit', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called on init', () => {
        const spy = sinon.spy(),
            C1 = createComponent({
                onInit : spy
            });

        mountSync(domNode, createNode(C1));

        expect(spy.called).to.be.ok();
    });
});
