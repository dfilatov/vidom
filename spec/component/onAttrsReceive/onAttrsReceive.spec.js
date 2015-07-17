var sinon = require('sinon'),
    createNode = require('../../../lib/createNode'),
    createComponent = require('../../../lib/createComponent'),
    mounter = require('../../../lib/client/mounter');

describe('onAttrsReceive', function() {
    var domNode;
    beforeEach(function() {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(function() {
        mounter.unmountFromDom(domNode);
        document.body.removeChild(domNode);
    });

    it('should be called when new attrs is passed', function() {
        var spy = sinon.spy(),
            C = createComponent({
                render : function() {
                    return createNode('div');
                },

                onAttrsReceive : spy
            }),
            oldAttrs = { id : 1 },
            newAttrs = { id : 2 };

        mounter.mountToDomSync(domNode, createNode(C).attrs(oldAttrs));
        mounter.mountToDomSync(domNode, createNode(C).attrs(newAttrs));

        expect(spy.called).to.be.ok();
        expect(spy.calledWith(newAttrs, oldAttrs)).to.be.ok();
    });

    it('shouldn\'t be called when no new attrs is passed', function() {
        var spy = sinon.spy(),
            C = createComponent({
                render : function() {
                    return createNode('div');
                },

                onAttrsReceive : spy
            });

        mounter.mountToDomSync(domNode, createNode(C));
        mounter.mountToDomSync(domNode, createNode(C));

        expect(spy.called).not.to.be.ok();
    });
});
