import sinon from 'sinon';
import emptyObj from '../../src/utils/emptyObj';
import { elem, mountSync, unmountSync } from '../../src/vidom';

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
        const stub = sinon.stub();

        stub.returns(null);

        mountSync(domNode, elem(stub));

        expect(stub.args[0][0]).to.be.equal(emptyObj);
    });

    it('should merge passed with default attributes', () => {
        const stub = sinon.stub();

        stub.returns(null);

        stub.defaultAttrs = { a : 1, b : 2 };

        mountSync(domNode, elem(stub).setAttrs({ a : 3 }));

        expect(stub.args[0][0]).to.be.eql({ a : 3, b : 2 });
    });
});
