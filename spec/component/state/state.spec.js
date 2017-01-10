import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountSync, unmountSync } from '../../../src/client/mounter';

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
                expect(this.getState()).to.be.eql({});
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });

    it('should be filled from onInitialStateRequest', done => {
        const C = createComponent({
            onInitialStateRequest() {
                return { prop : 'val' };
            },

            onInit() {
                expect(this.getState()).to.be.eql({ prop : 'val' });
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });

    it('should be properly updated with setState', done => {
        const C = createComponent({
            onInitialStateRequest() {
                return { prop1 : 'val1', prop2 : 'val2' };
            },

            onMount() {
                this.setState({ prop1 : 'val1_1', prop3 : 'val3' });
                this.setState({ prop4 : 'val4' });
            },

            onUpdate() {
                expect(this.getState()).to.be.eql({ prop1 : 'val1_1', prop2 : 'val2', prop3 : 'val3', prop4 : 'val4' });
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });

    it('shouldn\'t affect prev state till updating', done => {
        const C = createComponent({
            onInitialStateRequest() {
                return { prop1 : 'val1', prop2 : 'val2' };
            },

            onMount() {
                this.setState({ prop1 : 'val1_1', prop3 : 'val3' });
                this.setState({ prop4 : 'val4' });
            },

            onUpdate() {
                expect(this.getPrevState()).to.be.eql({ prop1 : 'val1', prop2 : 'val2' });
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });

    it('should be possible to get both state and previous state inside shouldUpdate', done => {
        const C = createComponent({
            onInitialStateRequest() {
                return { prop1 : 'val1', prop2 : 'val2' };
            },

            onMount() {
                this.setState({ prop1 : 'val1_1', prop3 : 'val3' });
            },

            shouldUpdate() {
                expect(this.getState()).to.be.eql({ prop1 : 'val1_1', prop2 : 'val2', prop3 : 'val3' });
                expect(this.getPrevState()).to.be.eql({ prop1 : 'val1', prop2 : 'val2' });
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });

    it('should be possible to get both state and previous state inside onUpdate', done => {
        const C = createComponent({
            onInitialStateRequest() {
                return { prop1 : 'val1', prop2 : 'val2' };
            },

            onMount() {
                this.setState({ prop1 : 'val1_1', prop3 : 'val3' });
            },

            onUpdate() {
                expect(this.getState()).to.be.eql({ prop1 : 'val1_1', prop2 : 'val2', prop3 : 'val3' });
                expect(this.getPrevState()).to.be.eql({ prop1 : 'val1', prop2 : 'val2' });
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });
});
