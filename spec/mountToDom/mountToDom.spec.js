import sinon from 'sinon';
import createNode from '../../src/createNode';
import { mountToDom, unmountFromDom } from '../../src/client/mounter';

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
            mountToDom(domNode, createNode('div'), () => {
                expect(domNode.childNodes.length).to.equal(1);
                done();
            });
        });

        it('should properly call callback after tree is remounted with diff', done => {
            mountToDom(domNode, createNode('div'), () => {
                mountToDom(domNode, createNode('span'), () => {
                    expect(domNode.childNodes[0].tagName).to.equal('SPAN');
                    done();
                });
            });
        });

        it('should properly call callback after tree is remounted without diff', done => {
            mountToDom(domNode, createNode('div'), () => {
                mountToDom(domNode, createNode('div'), () => {
                    done();
                });
            });
        });

        it('shouldn\'t call callback if a new tree is mounted', done => {
            const spy = sinon.spy();

            mountToDom(domNode, createNode('div'), spy);
            mountToDom(domNode, createNode('div'), () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });

        it('shouldn\'t call callback if a tree is unmounted', done => {
            const spy = sinon.spy();

            mountToDom(domNode, createNode('div'), spy);
            unmountFromDom(domNode, () => {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });

        it('shouldn\'t try to mount a tree to non-element nodes', done => {
            domNode.appendChild(document.createTextNode('test'));
            mountToDom(domNode, createNode('div').children(createNode('span')), done);
        });
    });
});
