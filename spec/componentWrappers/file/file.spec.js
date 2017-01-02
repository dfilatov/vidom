import { node, createRef, mountSync, unmountSync } from '../../../src/vidom';

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
        const ref = createRef();

        mountSync(
            domNode,
            node('input')
                .attrs({ type : 'file', id : 'id1' })
                .ref(ref));

        expect(ref.resolve()).to.be.equal(document.getElementById('id1'));
    });
});
