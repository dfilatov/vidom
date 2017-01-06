import simulate from 'simulate';
import { node, mountSync, unmountSync } from '../../../src/vidom';

describe('input', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should maintain value', () => {
        mountSync(domNode, node('input').attrs({ id : 'input', value : 'test' }));

        const input = document.getElementById('input');

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
            mountSync(domNode, node('input').attrs({ id : 'input', value, onChange }));
        }

        render();

        const input = document.getElementById('input');

        input.value = 'test-changed';
        simulate.input(input);

        expect(input.value).to.equal('test-changed');
    });

    it('should return dom node as ref', () => {
        let ref;

        mountSync(
            domNode,
            node('input').attrs({ id : 'input', ref(_ref) { ref = _ref; } }));

        expect(ref === document.getElementById('input'));
    });
});
