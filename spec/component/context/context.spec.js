import { createComponent, mount, mountSync, unmountSync, IS_DEBUG } from '../../../src/vidom';
import emptyObj from '../../../src/utils/emptyObj';
import { h } from '../../helpers';

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

        mountSync(domNode, h(C));
    });

    it('should be passed through tree', done => {
        const context = { prop : 'val' },
            C1 = createComponent({
                onChildContextRequest() {
                    return context;
                },

                onRender() {
                    return h('div', { children : h('fragment', { children : this.children }) });
                }
            }),
            C2 = createComponent({
                onInit() {
                    expect(this.context).to.be.equal(context);
                    done();
                }
            });

        mountSync(domNode, h(C1, {
            children : h('div', {
                children : h('div', {
                    children : h(() => h('div', { children : h(C2) }))
                })
            })
        }));
    });

    it('should be merged through tree', done => {
        const C1 = createComponent({
                onChildContextRequest() {
                    return { prop1 : 'val1' };
                },

                onRender() {
                    return h('div', { children : this.children });
                }
            }),
            C2 = createComponent({
                onChildContextRequest() {
                    return { prop2 : 'val2' };
                },

                onRender() {
                    return h('div', { children : this.children });
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

        mountSync(domNode, h(C1, {
            children : h('div', {
                children : h('div', {
                    children : h(() => h('div', {
                        children : h(C2, {
                            children : h('div', { children : h(C3) })
                        })
                    }))
                })
            })
        }));
    });

    it('shouldn\'t be polluted for sibling nodes', done => {
        const C1 = createComponent({
                onChildContextRequest() {
                    return { prop1 : 'val1' };
                },

                onRender() {
                    return h('div', { children : this.children });
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

        mountSync(domNode, h(C1, { children : [h(C2), h(C3)] }));
    });

    it('shouldn\'t be updated after patching', done => {
        const C1 = createComponent({
                onChildContextRequest() {
                    return { prop1 : this.attrs.prop };
                },

                onRender() {
                    return h('div', { children : this.children });
                }
            }),
            C2 = createComponent({
                onChildContextRequest() {
                    return { prop2 : this.attrs.prop };
                },

                onRender() {
                    return h('div', { children : this.children });
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
            FC = ({ prop }) => h('div', {
                children : h(C2, { prop, children : h('div', { children : h(C3) }) })
            });

        mount(
            domNode,
            h(C1, {
                prop : 'val1',
                children : h('div', {
                    children : h('div', { children : h(FC, { prop : 'val2' }) })
                })
            }),
            () => {
                mount(
                    domNode,
                    h(C1, {
                        prop : 'val3',
                        children : h('div', { children : h('div', { children : h(FC, { prop : 'val4' }) }) })
                    }));
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

            mountSync(domNode, h(C));
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

            mountSync(domNode, h(C));
        });
    }
});
