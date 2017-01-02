import { node, createComponent, createRef, mountSync, unmountSync } from '../../src/vidom';

describe('ref', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    describe('for tag nodes', () => {
        it('should be resolved with dom node', () => {
            const ref = createRef();

            mountSync(domNode, node('div').attrs({ id : 'id1' }).ref(ref));

            expect(ref.resolve()).to.be.equal(document.getElementById('id1'));
        });
    });

    describe('for component nodes', () => {
        it('should be resolved with component instance', () => {
            const C = createComponent({}),
                ref = createRef();

            mountSync(domNode, node(C).ref(ref));

            expect(ref.resolve()).to.be.a(C);
        });
    });
});
