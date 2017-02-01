import sinon from 'sinon';
import emptyObj from '../../src/utils/emptyObj';
import { node, mountSync, unmountSync } from '../../src/vidom';

describe('functionComponent', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should pass empty object as attrs if they aren\'t specified', () => {
        const spy = sinon.spy();

        mountSync(domNode, node(spy));

        expect(spy.args[0][0]).to.be.equal(emptyObj);
    });
});
