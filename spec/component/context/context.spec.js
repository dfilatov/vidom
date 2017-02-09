import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mount, mountSync, unmountSync } from '../../../src/client/mounter';
import emptyObj from '../../../src/utils/emptyObj';
import { IS_DEBUG } from '../../../src/utils/debug';

describe('context', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be empty by default', done => {
        const C = createComponent({
            onInit() {
                expect(this.context).to.be.equal(emptyObj);
                done();
            }
        });

        mountSync(domNode, createNode(C));
    });

    it('should be passed through tree', done => {
        const context = { prop : 'val' },
            C1 = createComponent({
                onChildContextRequest() {
                    return context;
                },

                onRender() {
                    return createNode('div').setChildren(createNode('fragment').setChildren(this.children));
                }
            }),
            C2 = createComponent({
                onInit() {
                    expect(this.context).to.be.equal(context);
                    done();
                }
            });

        mountSync(domNode, createNode(C1).setChildren([
            createNode('div').setChildren([
                createNode('div').setChildren([
                    createNode(() => createNode('div').setChildren([
                        createNode(C2)
                    ]))
                ])
            ])
        ]));
    });

    it('should be merged through tree', done => {
        const C1 = createComponent({
                onChildContextRequest() {
                    return { prop1 : 'val1' };
                },

                onRender() {
                    return createNode('div').setChildren(this.children);
                }
            }),
            C2 = createComponent({
                onChildContextRequest() {
                    return { prop2 : 'val2' };
                },

                onRender() {
                    return createNode('div').setChildren(this.children);
                }
            }),
            C3 = createComponent({
                onInit() {
                    expect(this.context).to.be.eql({
                        prop1 : 'val1',
                        prop2 : 'val2'
                    });
                    done();
                }
            });

        mountSync(domNode, createNode(C1).setChildren([
            createNode('div').setChildren([
                createNode('div').setChildren([
                    createNode(() => createNode('div').setChildren([
                        createNode(C2).setChildren([
                            createNode('div').setChildren([
                                createNode(C3)
                            ])
                        ])
                    ]))
                ])
            ])
        ]));
    });

    it('shouldn\'t be polluted for sibling nodes', done => {
        const C1 = createComponent({
                onChildContextRequest() {
                    return { prop1 : 'val1' };
                },

                onRender() {
                    return createNode('div').setChildren(this.children);
                }
            }),
            C2 = createComponent({
                onChildContextRequest() {
                    return { prop2 : 'val2' };
                }
            }),
            C3 = createComponent({
                onInit() {
                    expect(this.context).to.be.eql({ prop1 : 'val1' });
                    done();
                }
            });

        mountSync(domNode, createNode(C1).setChildren([
            createNode(C2),
            createNode(C3)
        ]));
    });

    it('shouldn\'t be updated after patching', done => {
        const C1 = createComponent({
                onChildContextRequest() {
                    return { prop1 : this.attrs.prop };
                },

                onRender() {
                    return createNode('div').setChildren(this.children);
                }
            }),
            C2 = createComponent({
                onChildContextRequest() {
                    return { prop2 : this.attrs.prop };
                },

                onRender() {
                    return createNode('div').setChildren(this.children);
                }
            }),
            C3 = createComponent({
                onUpdate() {
                    expect(this.context).to.be.eql({
                        prop1 : 'val3',
                        prop2 : 'val4'
                    });
                    done();
                }
            }),
            FC = ({ prop }) =>
                createNode('div').setChildren(
                    createNode(C2).setAttrs({ prop }).setChildren(
                        createNode('div').setChildren(createNode(C3))));

        mount(
            domNode,
            createNode(C1).setAttrs({ prop : 'val1' }).setChildren(
                createNode('div').setChildren(
                    createNode('div').setChildren(
                        createNode(FC).setAttrs({ prop : 'val2' })))),
            () => {
                mount(
                    domNode,
                    createNode(C1).setAttrs({ prop : 'val3' }).setChildren(
                        createNode('div').setChildren(
                            createNode('div').setChildren(
                                createNode(FC).setAttrs({ prop : 'val4' })))));
            });
    });

    if(IS_DEBUG) {
        it('should throw exception if attempt to replace context directly', done => {
            const C = createComponent({
                onInit() {
                    expect(() => {
                        this.context = { prop1 : 'val1' };
                    }).to.throwException(function(e) {
                        expect(e).to.be.a(TypeError);
                        done();
                    });
                }
            });

            mountSync(domNode, createNode(C));
        });

        it('should throw exception if attempt to modify context directly', done => {
            const C = createComponent({
                onInit() {
                    expect(() => {
                        this.context.prop1 = 'val1';
                    }).to.throwException(function(e) {
                        expect(e).to.be.a(TypeError);
                        done();
                    });
                }
            });

            mountSync(domNode, createNode(C));
        });
    }
});
