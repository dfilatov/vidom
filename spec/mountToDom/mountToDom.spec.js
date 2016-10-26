import sinon from 'sinon';
import { node, createComponent, mountToDom, unmountFromDom } from '../../src/vidom';

describe('mountToDom', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(done => {
        unmountFromDom(domNode, () => {
            document.body.removeChild(domNode);
            done();
        });
    });

    describe('callbacks', () => {
        it('should properly call callback on initial mount', done => {
            mountToDom(domNode, node('div'), () => {
                expect(domNode.childNodes.length).to.equal(1);
                done();
            });
        });

        it('should properly call callback after tree is remounted with diff', done => {
            mountToDom(domNode, node('div'), () => {
                mountToDom(domNode, node('span'), () => {
                    expect(domNode.childNodes[0].tagName).to.equal('SPAN');
                    done();
                });
            });
        });

        it('should properly call callback after tree is remounted without diff', done => {
            mountToDom(domNode, node('div'), () => {
                mountToDom(domNode, node('div'), () => {
                    done();
                });
            });
        });

        it('shouldn\'t call callback if a new tree is mounted', done => {
            const spy = sinon.spy();

            mountToDom(domNode, node('div'), spy);
            mountToDom(domNode, node('div'), () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });

        it('shouldn\'t call callback if a tree is unmounted', done => {
            const spy = sinon.spy();

            mountToDom(domNode, node('div'), spy);
            unmountFromDom(domNode, () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });
    });

    describe('replacing', () => {
        it('should replace extraneous dom', done => {
            domNode.appendChild(document.createElement('span'));
            mountToDom(domNode, node('div'), () => {
                expect(domNode.childNodes.length).to.equal(1);
                expect(domNode.childNodes[0].tagName.toLowerCase()).to.equal('div');
                done();
            });
        });
    });

    describe('context', () => {
        it('should pass context to inner components', done => {
            const ctx = { prop : 'val' },
                C = createComponent({
                    onMount() {
                        expect(this.getContext()).to.equal(ctx);
                        done();
                    }
                });

            mountToDom(domNode, node('div').children(node(C)), ctx);
        });
    });
});
