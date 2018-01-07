import sinon from 'sinon';
import { elem, createComponent, mount, unmount } from '../../src/vidom';

describe('mount', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(done => {
        unmount(domNode, () => {
            document.body.removeChild(domNode);
            done();
        });
    });

    describe('callbacks', () => {
        it('should properly call callback on initial mount', done => {
            mount(domNode, elem('div'), () => {
                expect(domNode.childNodes.length).to.equal(1);
                done();
            });
        });

        it('should properly call callback after tree is remounted with diff', done => {
            mount(domNode, elem('div'), () => {
                mount(domNode, elem('span'), () => {
                    expect(domNode.childNodes[0].tagName).to.equal('SPAN');
                    done();
                });
            });
        });

        it('should properly call callback after tree is remounted without diff', done => {
            mount(domNode, elem('div'), () => {
                mount(domNode, elem('div'), () => {
                    done();
                });
            });
        });

        it('shouldn\'t call callback if a new tree is mounted', done => {
            const spy = sinon.spy();

            mount(domNode, elem('div'), spy);
            mount(domNode, elem('div'), () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });

        it('shouldn\'t call callback if a tree is unmounted', done => {
            const spy = sinon.spy();

            mount(domNode, elem('div'), spy);
            unmount(domNode, () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });
    });

    describe('replacing', () => {
        it('should replace extraneous dom', done => {
            domNode.appendChild(document.createElement('span'));
            mount(domNode, elem('div'), () => {
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
                        expect(this.context).to.equal(ctx);
                        done();
                    }
                });

            mount(domNode, elem('div').setChildren(elem(C)), ctx);
        });
    });
});
