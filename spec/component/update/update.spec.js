import { createComponent, mountSync, unmountSync } from '../../../src/vidom';
import { h } from '../../helpers';

describe('update', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    it('should update component tree from top to bottom regardless of the order of calling setState', done => {
        const order = [],
            A = createComponent({
                onRender() {
                    order.push('A');
                    return h(B, {
                        onEvent : () => {
                            this.update();
                        }
                    });
                },

                onUpdate() {
                    expect(order)
                        .to.be.eql(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D']);
                    done();
                }
            }),
            B = createComponent({
                onRender() {
                    order.push('B');
                    return h(C, {
                        onEvent : () => {
                            this.update();
                            this.attrs.onEvent();
                        }
                    });
                }
            }),
            C = createComponent({
                onRender() {
                    order.push('C');
                    return h(D, {
                        onEvent : () => {
                            this.attrs.onEvent();
                            this.update();
                        }
                    });
                }
            }),
            D = createComponent({
                onRender() {
                    order.push('D');
                    return null;
                },

                onMount() {
                    setTimeout(() => {
                        this.attrs.onEvent();
                        this.update();
                    }, 50);
                }
            });

        mountSync(domNode, h(A));
    });
});
