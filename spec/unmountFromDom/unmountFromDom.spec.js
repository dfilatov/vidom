var sinon = require('sinon'),
    createNode = require('../../lib/createNode'),
    mounter = require('../../lib/client/mounter');

describe('unmountFromDom', function() {
    var domNode;
    beforeEach(function() {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(function() {
        document.body.removeChild(domNode);
    });

    describe('callbacks', function() {
        it('should properly call callback on unmount', function(done) {
            mounter.mountToDom(domNode, createNode('div'), function() {
                mounter.unmountFromDom(domNode, function() {
                    expect(domNode.childNodes.length).to.equal(0);
                    done();
                });
            });
        });

        it('should properly call callback if there\'s no mounted tree', function(done) {
            mounter.unmountFromDom(domNode, function() {
                done();
            });
        });
    });
});
