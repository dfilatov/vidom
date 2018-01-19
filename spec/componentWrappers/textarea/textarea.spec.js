import sinon from 'sinon';
import simulate from 'simulate';
import { mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

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
        mountSync(domNode, h('textarea', { id : 'textarea', value : 'test' }));

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
            mountSync(domNode, h('textarea', { id : 'textarea', value, onChange }));
        }

        render();

        const input = document.getElementById('textarea');

        input.value = 'test-changed';
        simulate.input(input);

        expect(input.value).to.equal('test-changed');
    });

    it('should not call onChange if actual value is not changed', () => {
        const spy = sinon.spy();

        mountSync(
            domNode,
            h('textarea', { id : 'input', value : 'test', onChange : spy }));

        const input = document.getElementById('input');

        simulate.input(input);

        expect(spy.called).not.to.be.ok();
    });

    it('should return dom node as ref', () => {
        let ref;

        mountSync(
            domNode,
            h('textarea', { id : 'textarea', ref(_ref) { ref = _ref; } }));

        expect(ref === document.getElementById('textarea'));
    });
});
