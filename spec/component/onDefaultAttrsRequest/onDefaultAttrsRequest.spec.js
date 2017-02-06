import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountSync, unmountSync } from '../../../src/client/mounter';
import emptyObj from '../../../src/utils/emptyObj';

describe('onDefaultAttrsRequest', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should provide empty attributes if not defined', done => {
        const C1 = createComponent({
            onInit() {
                expect(this.attrs).to.be.equal(emptyObj);
                done();
            }
        });

        mountSync(domNode, createNode(C1));
    });

    it('should provide passed attributes if not defined', done => {
        const attrs = { a : 1 },
            C1 = createComponent({
                onInit() {
                    expect(this.attrs).to.be.equal(attrs);
                    done();
                }
            });

        mountSync(domNode, createNode(C1).attrs(attrs));
    });

    it('should merge passed with default attributes', done => {
        const C1 = createComponent({
            onInit() {
                expect(this.attrs).to.be.eql({ a : 3, b : 2 });
                done();
            }
        }, {
            onDefaultAttrsRequest() {
                return { a : 1, b : 2 };
            }
        });

        mountSync(domNode, createNode(C1).attrs({ a : 3 }));
    });
});
