import simulate from 'simulate';
import { node, createRef, mountSync, unmountSync } from '../../../src/vidom';

describe('textarea', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should maintain value', () => {
        mountSync(domNode, node('textarea').attrs({ id : 'textarea', value : 'test' }));

        const input = document.getElementById('textarea');

        input.value = 'test-changed';
        simulate.input(input);

        expect(input.value).to.equal('test');
    });

    it('should update value', () => {
        let value = 'test';

        function onChange(e) {
            value = e.target.value;
            render();
        }

        function render() {
            mountSync(domNode, node('textarea').attrs({ id : 'textarea', value, onChange }));
        }

        render();

        const input = document.getElementById('textarea');

        input.value = 'test-changed';
        simulate.input(input);

        expect(input.value).to.equal('test-changed');
    });

    it('should return dom node as ref', () => {
        const ref = createRef();

        mountSync(
            domNode,
            node('textarea')
                .attrs({ id : 'textarea' })
                .ref(ref));

        expect(ref.resolve()).to.be.equal(document.getElementById('textarea'));
    });
});
