import simulate from 'simulate';
import { h, mountSync, unmountSync } from '../../../src/vidom';

describe('select', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should maintain value', () => {
        mountSync(domNode, h('select', { id : 'select', value : '1' }, [
            h('option', { value : '1', id : 'opt1' }),
            h('option', { value : '2', id : 'opt2' })
        ]));

        const select = document.getElementById('select'),
            firstOption = document.getElementById('opt1'),
            secondOption = document.getElementById('opt2');

        secondOption.selected = true;
        simulate.change(select);

        expect(firstOption.selected).to.be.ok();
        expect(secondOption.selected).not.to.be.ok();
        expect(select.value).to.equal('1');
    });

    it('should maintain multiple value', () => {
        mountSync(domNode, h('select', { id : 'select', multiple : true, value : ['1', '2'] }, [
            h('option', { value : '1', id : 'opt1' }),
            h('option', { value : '2', id : 'opt2' }),
            h('option', { value : '3', id : 'opt3' })
        ]));

        const select = document.getElementById('select'),
            firstOption = document.getElementById('opt1'),
            secondOption = document.getElementById('opt2'),
            thirdOption = document.getElementById('opt3');

        secondOption.selected = false;
        thirdOption.selected = true;
        simulate.change(select);

        expect(firstOption.selected).to.be.ok();
        expect(secondOption.selected).to.be.ok();
        expect(thirdOption.selected).not.to.be.ok();
    });

    it('should update value', () => {
        let value = '1';

        function onChange(e) {
            value = e.target.value;
            render();
        }

        function render() {
            mountSync(domNode, h('select', { id : 'select', value, onChange }, [
                h('option', { value : '1', id : 'opt1' }),
                h('option', { value : '2', id : 'opt2' })
            ]));
        }

        render();

        const select = document.getElementById('select'),
            secondOption = document.getElementById('opt2');

        secondOption.selected = true;
        simulate.change(select);

        expect(secondOption.selected).to.be.ok();
        expect(select.value).to.equal('2');
    });

    it('should update multiple value', () => {
        let value = ['1'];

        function onChange(e, val) {
            value = val;
            render();
        }

        function render() {
            mountSync(domNode, h('select', { id : 'select', multiple : true, value, onChange }, [
                h('option', { value : '1', id : 'opt1' }),
                h('option', { value : '2', id : 'opt2' })
            ]));
        }

        render();

        const select = document.getElementById('select'),
            firstOption = document.getElementById('opt1'),
            secondOption = document.getElementById('opt2');

        secondOption.selected = true;
        simulate.change(select);

        expect(firstOption.selected).to.be.ok();
        expect(secondOption.selected).to.be.ok();
    });

    it('should return dom node as ref', () => {
        let ref;

        mountSync(
            domNode,
            h('select', { id : 'select', ref(_ref) { ref = _ref; } }));

        expect(ref === document.getElementById('select'));
    });
});
