var sinon = require('sinon'),
    createNode = require('../../../lib/createNode'),
    createComponent = require('../../../lib/createComponent'),
    mounter = require('../../../lib/client/mounter');

describe('onMount', function() {
    var domNode;
    beforeEach(function() {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(function() {
        mounter.unmountFromDom(domNode);
        document.body.removeChild(domNode);
    });

    it('should be recursively called', function(done) {
        var spy1 = sinon.spy(),
            spy2 = sinon.spy(),
            spy3 = sinon.spy(),
            C1 = createComponent({
                onMount : spy1,
                render : function() {
                    return createNode('div').children(createNode(C2).children(createNode(C3)));
                }
            }),
            C2 = createComponent({
                onMount : spy2,
                render : function(_, content) {
                    return createNode('div').children(content);
                }
            }),
            C3 = createComponent({
                onMount : spy3,
                render : function() {
                    return createNode('div');
                }
            });

        mounter.mountToDom(domNode, createNode(C1), function() {
            expect(spy1.called).to.be.ok();
            expect(spy2.called).to.be.ok();
            expect(spy3.called).to.be.ok();

            done();
        });
    });
});
