import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountSync, unmountSync } from '../../../src/client/mounter';

describe('dom refs', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should point to the right DOM element', function(done) {
        const C = createComponent({
            onRender() {
                return createNode('div').children([
                    createNode('div'),
                    this.setDomRef('control', createNode('span').attrs({ id : 'id1' }))
                ]);
            },

            onMount() {
                expect(this.getDomRef('control')).to.be.equal(document.getElementById('id1'));
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });

    it('should be reset on each render', function(done) {
        let switchRef = true;
        const C = createComponent({
            onRender() {
                const refNode = createNode('span');

                if(switchRef) {
                    this.setDomRef('control', refNode.attrs({ id : 'id1' }));
                    switchRef = false;
                }
                else {
                    this.setDomRef('control-new', refNode.attrs({ id : 'id2' }));
                }

                return createNode('div').children([createNode('div'), refNode]);
            },

            onUpdate() {
                expect(this.getDomRef('control')).to.be.equal(null);
                expect(this.getDomRef('control-new')).to.be.equal(document.getElementById('id2'));
                done();
            }
        });

        mountSync(domNode, createNode(C));
        mountSync(domNode, createNode(C));
    });
});
