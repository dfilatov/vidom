import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountSync, unmountSync } from '../../../src/client/mounter';
import emptyObj from '../../../src/utils/emptyObj';
import { IS_DEBUG } from '../../../src/utils/debug';

describe('attrs', () => {
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

        mountSync(domNode, createNode(C1).setAttrs(attrs));
    });

    it('should merge passed with default attributes', done => {
        const C1 = createComponent({
            onInit() {
                expect(this.attrs).to.be.eql({ a : 3, b : 2 });
                done();
            }
        }, {
            defaultAttrs : { a : 1, b : 2 }
        });

        mountSync(domNode, createNode(C1).setAttrs({ a : 3 }));
    });

    it('should merge passed with default attributes after update', done => {
        const C1 = createComponent({
            onUpdate() {
                expect(this.attrs).to.be.eql({ a : 4, b : 2 });
                done();
            }
        }, {
            defaultAttrs : { a : 1, b : 2 }
        });

        mountSync(domNode, createNode(C1).setAttrs({ a : 3 }));
        mountSync(domNode, createNode(C1).setAttrs({ a : 4 }));
    });

    if(IS_DEBUG) {
        it('should throw exception if attempt to replace attrs directly', done => {
            const C = createComponent({
                onInit() {
                    expect(() => {
                        this.attrs = { prop1 : 'val1' };
                    }).to.throwException(function(e) {
                        expect(e).to.be.a(TypeError);
                        done();
                    });
                }
            });

            mountSync(domNode, createNode(C));
        });

        it('should throw exception if attempt to modify attrs directly', done => {
            const C = createComponent({
                onInit() {
                    expect(() => {
                        this.attrs.prop1 = 'val1';
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
