import simulate from 'simulate';
import { node, mountSync, unmountSync } from '../../../src/vidom';

describe('checkbox', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should maintain checked property', () => {
        mountSync(domNode, node('div').children([
            node('input').attrs({ type : 'checkbox', id : 'id1', checked : true }),
            node('input').attrs({ type : 'checkbox', id : 'id2', checked : false })
        ]));

        const firstCheckbox = document.getElementById('id1'),
            secondCheckbox = document.getElementById('id2');

        firstCheckbox.checked = false;
        simulate.change(firstCheckbox);

        secondCheckbox.checked = true;
        simulate.change(secondCheckbox);

        expect(firstCheckbox.checked).to.be.ok();
        expect(secondCheckbox.checked).not.to.be.ok();
    });

    it('should update checked property', () => {
        let checkedState = false;

        function onChange() {
            checkedState = !checkedState;
            render();
        }

        function render() {
            mountSync(domNode, node('div').children(
                node('input').attrs({ type : 'checkbox', id : 'id1', checked : checkedState, onChange })
            ));
        }

        render();

        const checkbox = document.getElementById('id1');

        checkbox.checked = true;
        simulate.change(checkbox);

        expect(checkbox.checked).to.be.ok();
    });

    it('should return dom node as ref', () => {
        let ref;

        mountSync(
            domNode,
            node('input').attrs({ type : 'checkbox', id : 'id1', ref(_ref) { ref = _ref; } }));

        expect(ref === document.getElementById('id1'));
    });
});
