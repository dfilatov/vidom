import sinon from 'sinon';
import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

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

        mountSync(domNode, h(C1));

        expect(spy.called).to.be.ok();
    });
});
