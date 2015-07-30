var sinon = require('sinon'),
    createNode = require('../../../lib/createNode'),
    createComponent = require('../../../lib/createComponent'),
    mounter = require('../../../lib/client/mounter');

describe('onUpdate', function() {
    var domNode;
    beforeEach(function() {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(function() {
        mounter.unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called after a component is updated with actual attributes', function() {
        var spy = sinon.spy(),
            C = createComponent({
                onRender : function(attrs) {
                    return createNode('div').attrs(attrs);
                },

                onUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mounter.mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mounter.mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs)).to.be.ok();
    });

    it.skip('should not be called if component isn\'t updated', function() {
        var spy = sinon.spy(),
            C = createComponent({
                onRender : function(attrs) {
                    return createNode('div').attrs(attrs);
                },

                onUpdate : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 1 };

        mounter.mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mounter.mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).not.to.be.ok();
    });
});
