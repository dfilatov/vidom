import createNode from '../../../src/createNode';
import createComponent from '../../../src/createComponent';
import { mountToDom, mountToDomSync, unmountFromDomSync } from '../../../src/client/mounter';

describe('context', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountFromDomSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should be empty by default', done => {
        const C = createComponent({
            onInit() {
                expect(this.getContext()).to.be.eql({});
                done();
            }
        });

        mountToDomSync(domNode, createNode(C));
    });

    it('should be passed through tree', done => {
        const C1 = createComponent({
                onChildContextRequest() {
                    return { prop : 'val' };
                },

                onRender(_, children) {
                    return createNode('div').children(children);
                }
            }),
            C2 = createComponent({
                onInit() {
                    expect(this.getContext()).to.be.eql({ prop : 'val' });
                    done();
                }
            });

        mountToDomSync(domNode, createNode(C1).children([
            createNode('div').children([
                createNode('div').children([
                    createNode(() => createNode('div').children([
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

                onRender(_, children) {
                    return createNode('div').children(children);
                }
            }),
            C2 = createComponent({
                onChildContextRequest() {
                    return { prop2 : 'val2' };
                },

                onRender(_, children) {
                    return createNode('div').children(children);
                }
            }),
            C3 = createComponent({
                onInit() {
                    expect(this.getContext()).to.be.eql({
                        prop1 : 'val1',
                        prop2 : 'val2'
                    });
                    done();
                }
            });

        mountToDomSync(domNode, createNode(C1).children([
            createNode('div').children([
                createNode('div').children([
                    createNode(() => createNode('div').children([
                        createNode(C2).children([
                            createNode('div').children([
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

                onRender(_, children) {
                    return createNode('div').children(children);
                }
            }),
            C2 = createComponent({
                onChildContextRequest() {
                    return { prop2 : 'val2' };
                }
            }),
            C3 = createComponent({
                onInit() {
                    expect(this.getContext()).to.be.eql({ prop1 : 'val1' });
                    done();
                }
            });

        mountToDomSync(domNode, createNode(C1).children([
            createNode(C2),
            createNode(C3)
        ]));
    });

    it('shouldn\'t be updated after patching', done => {
        const C1 = createComponent({
                onChildContextRequest(attrs) {
                    return { prop1 : attrs.prop };
                },

                onRender(_, children) {
                    return createNode('div').children(children);
                }
            }),
            C2 = createComponent({
                onChildContextRequest(attrs) {
                    return { prop2 : attrs.prop };
                },

                onRender(_, children) {
                    return createNode('div').children(children);
                }
            }),
            C3 = createComponent({
                onUpdate() {
                    expect(this.getContext()).to.be.eql({
                        prop1 : 'val3',
                        prop2 : 'val4'
                    });
                    done();
                }
            });

        mountToDom(domNode, createNode(C1).attrs({ prop : 'val1' }).children([
            createNode('div').children([
                createNode('div').children([
                    createNode(() => createNode('div').children([
                        createNode(C2).attrs({ prop : 'val2' }).children([
                            createNode('div').children([
                                createNode(C3)
                            ])
                        ])
                    ]))
                ])
            ])
        ]), () => {
            mountToDom(domNode, createNode(C1).attrs({ prop : 'val3' }).children([
                createNode('div').children([
                    createNode('div').children([
                        createNode(() => createNode('div').children([
                            createNode(C2).attrs({ prop : 'val4' }).children([
                                createNode('div').children([
                                    createNode(C3)
                                ])
                            ])
                        ]))
                    ])
                ])
            ]));
        });
    });
});
