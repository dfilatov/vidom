var createNode = require('../../../lib/createNode'),
    createComponent = require('../../../lib/createComponent'),
    mounter = require('../../../lib/client/mounter');

describe('dom refs', function() {
    var domNode;
    beforeEach(function() {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(function() {
        mounter.unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should point to the right DOM element', function(done) {
        var C = createComponent({
                onRender : function() {
                    return createNode('div').children([
                        createNode('div'),
                        this.setDomRef('control', createNode('span').attrs({ id : 'id1' }))
                    ]);
                },

                onMount : function() {
                    expect(this.getDomRef('control')).to.be.equal(document.getElementById('id1'));
                    done();
                }
            });

        mounter.mountToDomSync(domNode, createNode(C));
    });

    it('should be reset on each render', function(done) {
        var switchRef = true,
            C = createComponent({
                onRender : function() {
                    var refNode = createNode('span');

                    if(switchRef) {
                        this.setDomRef('control', refNode.attrs({ id : 'id1' }));
                        switchRef = false;
                    }
                    else {
                        this.setDomRef('control-new', refNode.attrs({ id : 'id2' }));
                    }

                    return createNode('div').children([createNode('div'), refNode]);
                },

                onUpdate : function() {
                    expect(this.getDomRef('control')).to.be.equal(null);
                    expect(this.getDomRef('control-new')).to.be.equal(document.getElementById('id2'));
                    done();
                }
            });

        mounter.mountToDomSync(domNode, createNode(C));
        mounter.mountToDomSync(domNode, createNode(C));
    });
});
