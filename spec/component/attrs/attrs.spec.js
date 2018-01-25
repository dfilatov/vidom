import { createComponent, mountSync, unmountSync, IS_DEBUG } from '../../../src/vidom';
import emptyObj from '../../../src/utils/emptyObj';
import { h } from '../../helpers';

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

        mountSync(domNode, h(C1));
    });

    it('should provide passed attributes if not defined', done => {
        const attrs = { a : 1 },
            C1 = createComponent({
                onInit() {
                    expect(this.attrs).to.be.equal(attrs);
                    done();
                }
            });

        mountSync(domNode, h(C1, attrs));
    });

    it('should merge passed with default attributes', done => {
        const C1 = createComponent({
            onInit() {
                expect(this.attrs).to.be.eql({ a : 3, b : 2, c : 3 });
                done();
            }
        }, {
            defaultAttrs : { a : 1, b : 2, c : 3 }
        });

        mountSync(domNode, h(C1, { a : 3, c : undefined }));
    });

    it('should merge passed with default attributes after update', done => {
        const C1 = createComponent({
            onReconcile() {
                expect(this.attrs).to.be.eql({ a : 4, b : 2, c : 3 });
                done();
            }
        }, {
            defaultAttrs : { a : 1, b : 2, c : 3 }
        });

        mountSync(domNode, h(C1, { a : 3, c : undefined }));
        mountSync(domNode, h(C1, { a : 4, c : undefined }));
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

            mountSync(domNode, h(C));
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

            mountSync(domNode, h(C));
        });
    }
});
