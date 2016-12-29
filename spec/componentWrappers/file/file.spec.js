import { node, mountSync, unmountSync } from '../../../src/vidom';

describe('file', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should return dom node as ref', () => {
        let ref;

        mountSync(
            domNode,
            node('input').attrs({ type : 'file', id : 'id1', ref(_ref) { ref = _ref; } }));

        expect(ref === document.getElementById('id1'));
    });
});
