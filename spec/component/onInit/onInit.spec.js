import sinon from 'sinon';
import { elem, createComponent, mountSync, unmountSync } from '../../../src/vidom';

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

        mountSync(domNode, elem(C1));

        expect(spy.called).to.be.ok();
    });
});
