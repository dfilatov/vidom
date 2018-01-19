import sinon from 'sinon';
import { createComponent, mount, unmount } from '../../src/vidom';
import { h } from '../helpers';

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
            mount(domNode, h('div'), () => {
                expect(domNode.childNodes.length).to.equal(1);
                done();
            });
        });

        it('should properly call callback after tree is remounted with diff', done => {
            mount(domNode, h('div'), () => {
                mount(domNode, h('span'), () => {
                    expect(domNode.childNodes[0].tagName).to.equal('SPAN');
                    done();
                });
            });
        });

        it('should properly call callback after tree is remounted without diff', done => {
            mount(domNode, h('div'), () => {
                mount(domNode, h('div'), () => {
                    done();
                });
            });
        });

        it('shouldn\'t call callback if a new tree is mounted', done => {
            const spy = sinon.spy();

            mount(domNode, h('div'), spy);
            mount(domNode, h('div'), () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });

        it('shouldn\'t call callback if a tree is unmounted', done => {
            const spy = sinon.spy();

            mount(domNode, h('div'), spy);
            unmount(domNode, () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });
    });

    describe('replacing', () => {
        it('should replace extraneous dom', done => {
            domNode.appendChild(document.createElement('span'));
            mount(domNode, h('div'), () => {
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

            mount(domNode, h('div', { children : h(C) }), ctx);
        });
    });
});
