import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountSync, unmountSync } from '../../../src/client/mounter';
import { IS_DEBUG } from '../../../src/utils/debug';

describe('children', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    if(IS_DEBUG) {
        it('should throw exception if attempt to replace children directly', done => {
            const C = createComponent({
                onInit() {
                    expect(() => {
                        this.children = 'children';
                    }).to.throwException(function(e) {
                        expect(e).to.be.a(TypeError);
                        done();
                    });
                }
            });

            mountSync(domNode, createNode(C));
        });
    }
});
