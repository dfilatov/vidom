import { createComponent, mountSync, unmountSync, IS_DEBUG } from '../../../src/vidom';
import emptyObj from '../../../src/utils/emptyObj';
import { h } from '../../helpers';

describe('state', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be empty by default', done => {
        const C = createComponent({
            onInit() {
                expect(this.state)
                    .to.be.equal(emptyObj);
                done();
            }
        });

        mountSync(domNode, h(C));
    });

    it('should be possible to fill it from init', done => {
        const C = createComponent({
            onInit() {
                this.setState({ prop1 : 'val1' });
                this.setState({ prop2 : 'val2' });
                done();
            },

            onMount() {
                expect(this.state)
                    .to.be.eql({ prop1 : 'val1', prop2 : 'val2' });
            }
        });

        mountSync(domNode, h(C));
    });

    it('should be properly updated with setState', done => {
        const C = createComponent({
            onInit() {
                this.setState({ prop1 : 'val1', prop2 : 'val2' });
            },

            onMount() {
                this.setState({ prop1 : 'val1_1', prop3 : 'val3' });
                this.setState({ prop4 : 'val4' });
            },

            onUpdate() {
                expect(this.state)
                    .to.be.eql({ prop1 : 'val1_1', prop2 : 'val2', prop3 : 'val3', prop4 : 'val4' });
                done();
            }
        });

        mountSync(domNode, h(C));
    });

    it('shouldn\'t affect prev state till updating', done => {
        const C = createComponent({
            onInit() {
                this.setState({ prop1 : 'val1' });
                this.setState({ prop2 : 'val2' });
            },

            onMount() {
                this.setState({ prop1 : 'val1_1', prop3 : 'val3' });
                this.setState({ prop4 : 'val4' });
            },

            onUpdate(prevAttrs, prevChildren, prevState) {
                expect(prevState)
                    .to.be.eql({ prop1 : 'val1', prop2 : 'val2' });
                done();
            }
        });

        mountSync(domNode, h(C));
    });

    it('should be possible to get both state and previous state inside onUpdate', done => {
        const C = createComponent({
            onInit() {
                this.setState({ prop1 : 'val1', prop2 : 'val2' });
            },

            onMount() {
                this.setState({ prop1 : 'val1_1', prop3 : 'val3' });
            },

            onUpdate(prevAttrs, prevChildren, prevState) {
                expect(this.state)
                    .to.be.eql({ prop1 : 'val1_1', prop2 : 'val2', prop3 : 'val3' });
                expect(prevState)
                    .to.be.eql({ prop1 : 'val1', prop2 : 'val2' });
                done();
            }
        });

        mountSync(domNode, h(C));
    });

    if(IS_DEBUG) {
        it('should throw exception if attempt to replace state directly', done => {
            const C = createComponent({
                onInit() {
                    expect(() => {
                        this.state = { prop1 : 'val1' };
                    }).to.throwException(function(e) {
                        expect(e).to.be.a(TypeError);
                        done();
                    });
                }
            });

            mountSync(domNode, h(C));
        });

        it('should throw exception if attempt to modify state directly', done => {
            const C = createComponent({
                onInit() {
                    expect(() => {
                        this.state.prop1 = 'val1';
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
