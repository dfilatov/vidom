var createNode = require('../../../lib/createNode'),
    createComponent = require('../../../lib/createComponent'),
    mounter = require('../../../lib/client/mounter');

describe('getRef', function() {
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
                        createNode('span').attrs({ id : 'id1' }).ref('control')
                    ]);
                },

                onMount : function() {
                    expect(this.getRef('control')).to.be.equal(document.getElementById('id1'));
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
                        refNode
                            .attrs({ id : 'id1' })
                            .ref('control');
                        switchRef = false;
                    }
                    else {
                        refNode
                            .attrs({ id : 'id2' })
                            .ref('control-new');
                    }

                    return createNode('div').children([createNode('div'), refNode]);
                },

                onUpdate : function() {
                    expect(this.getRef('control')).to.be.equal(null);
                    expect(this.getRef('control-new')).to.be.equal(document.getElementById('id2'));
                    done();
                }
            });

        mounter.mountToDomSync(domNode, createNode(C));
        mounter.mountToDomSync(domNode, createNode(C));
    });
});
