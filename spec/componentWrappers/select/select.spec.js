import simulate from 'simulate';
import { node, createRef, mountSync, unmountSync } from '../../../src/vidom';

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
        mountSync(domNode, node('select').attrs({ id : 'select', value : '1' }).children([
            node('option').attrs({ value : '1', id : 'opt1' }),
            node('option').attrs({ value : '2', id : 'opt2' })
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

    it('should update value', () => {
        let value = '1';

        function onChange(e) {
            value = e.target.value;
            render();
        }

        function render() {
            mountSync(domNode, node('select').attrs({ id : 'select', value, onChange }).children([
                node('option').attrs({ value : '1', id : 'opt1' }),
                node('option').attrs({ value : '2', id : 'opt2' })
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

    it('should return dom node as ref', () => {
        const ref = createRef();

        mountSync(
            domNode,
            node('select')
                .attrs({ id : 'select' })
                .ref(ref));

        expect(ref.resolve()).to.be.equal(document.getElementById('select'));
    });
});
