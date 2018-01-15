import { createComponent, mountSync, unmountSync, IS_DEBUG } from '../../../src/vidom';
import { h } from '../../helpers';

describe('children', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be passed as is', done => {
        const children = function() {},
            C = createComponent({
                onInit() {
                    expect(this.children)
                        .to.be.equal(children);
                    done();
                }
            });

        mountSync(domNode, h(C, { children }));
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

            mountSync(domNode, h(C));
        });
    }
});
