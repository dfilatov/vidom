var sinon = require('sinon'),
    createNode = require('../../lib/createNode'),
    mounter = require('../../lib/client/mounter');

describe('mountToDom', function() {
    var domNode;
    beforeEach(function() {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(function() {
        document.body.removeChild(domNode);
    });

    describe('callbacks', function() {
        it('should properly call callback on initial mount', function(done) {
            mounter.mountToDom(domNode, createNode('div'), function() {
                expect(domNode.childNodes.length).to.equal(1);
                done();
            });
        });

        it('should properly call callback after tree is remounted with diff', function(done) {
            mounter.mountToDom(domNode, createNode('div'), function() {
                mounter.mountToDom(domNode, createNode('span'), function() {
                    expect(domNode.childNodes[0].tagName).to.equal('SPAN');
                    done();
                });
            });
        });

        it('should properly call callback after tree is remounted without diff', function(done) {
            mounter.mountToDom(domNode, createNode('div'), function() {
                mounter.mountToDom(domNode, createNode('div'), function() {
                    done();
                });
            });
        });

        it('shouldn\'t call callback if a new tree is mounted', function(done) {
            var spy = sinon.spy();

            mounter.mountToDom(domNode, createNode('div'), spy);
            mounter.mountToDom(domNode, createNode('div'), function() {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });

        it('shouldn\'t call callback if a tree is unmounted', function(done) {
            var spy = sinon.spy();

            mounter.mountToDom(domNode, createNode('div'), spy);
            mounter.unmountFromDom(domNode, function() {
                expect(spy.called).not.to.be.ok();
                done();
            });
        });
    });
});
