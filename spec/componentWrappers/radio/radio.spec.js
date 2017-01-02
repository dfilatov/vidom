import simulate from 'simulate';
import { node, createRef, mountSync, unmountSync } from '../../../src/vidom';

describe('radio', () => {
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
            node('input').attrs({ type : 'radio', name : 'test', id : 'id1', checked : true }),
            node('input').attrs({ type : 'radio', name : 'test', id : 'id2', checked : false })
        ]));

        const secondRadio = document.getElementById('id2');

        secondRadio.checked = true;
        simulate.change(secondRadio);

        expect(document.getElementById('id1').checked).to.be.ok();
    });

    it('should update checked property', () => {
        let checkedState = false;

        function onChange() {
            checkedState = !checkedState;
            render();
        }

        function render() {
            mountSync(domNode, node('div').children([
                node('input').attrs({ type : 'radio', name : 'test', id : 'id1', checked : !checkedState }),
                node('input').attrs({ type : 'radio', name : 'test', id : 'id2', checked : checkedState, onChange })
            ]));
        }

        render();

        const secondRadio = document.getElementById('id2');

        secondRadio.checked = true;
        simulate.change(secondRadio);

        expect(document.getElementById('id1').checked).not.to.be.ok();
        expect(secondRadio.checked).to.be.ok();
    });

    it('should return dom node as ref', () => {
        const ref = createRef();

        mountSync(
            domNode,
            node('input')
                .attrs({ type : 'radio', id : 'id1' })
                .ref(ref));

        expect(ref.resolve()).to.be.equal(document.getElementById('id1'));
    });
});
