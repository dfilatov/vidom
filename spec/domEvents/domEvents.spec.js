import sinon from 'sinon';
import simulate from 'simulate';
import { elem, mountSync, unmountSync } from '../../src/vidom';

describe('domEvents', () => {
    let domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    describe('bubbleable events', () => {
        it('should properly add handler', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ onClick : spy1 }).setChildren([
                    elem('div').setAttrs({ onClick : spy2 }).setChildren(
                        elem('div').setAttrs({ id : 'id1' })),
                    elem('div').setAttrs({ onClick : spy3 }).setChildren(
                        elem('div').setAttrs({ id : 'id2' }))
                ]));

            simulate.click(document.getElementById('id1'));

            expect(spy1.called).to.be.ok();
            expect(spy2.called).to.be.ok();
            expect(spy3.called).not.to.be.ok();

            simulate.click(document.getElementById('id2'));

            expect(spy1.calledTwice).to.be.ok();
            expect(spy2.calledOnce).to.be.ok();
            expect(spy3.called).to.be.ok();
        });

        it('should properly call handler with SyntheticEvent object', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onClick : spy }));

            simulate.click(document.getElementById('id1'));

            const e = spy.args[0][0];

            expect(e.type).to.be.equal('click');
            expect(e.nativeEvent.type).to.be.equal('click');
        });

        it('should properly stop propagation', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ onClick : spy }).setChildren(
                    elem('div').setAttrs({
                        id : 'id1',
                        onClick : function(e) {
                            e.stopPropagation();
                        }
                    })));

            simulate.click(document.getElementById('id1'));

            expect(spy.called).not.to.be.ok();
        });

        it('should properly prevent default', () => {
            mountSync(
                domNode,
                elem('input').setAttrs({
                    type : 'checkbox',
                    id : 'id1',
                    onClick : function(e) {
                        e.preventDefault();
                    }
                }));

            simulate.click(document.getElementById('id1'));

            expect(document.getElementById('id1').checked).not.to.be.ok();
        });

        it('should properly remove handler', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onClick : spy1 }));

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onDblClick : spy2 }));

            simulate.click(document.getElementById('id1'));
            simulate.dblclick(document.getElementById('id1'));

            expect(spy1.called).not.to.be.ok();
            expect(spy2.called).to.be.ok();
        });

        it('should properly replace handler for bubbleable events', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onClick : spy1 }));

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onClick : spy2 }));

            simulate.click(document.getElementById('id1'));

            expect(spy1.called).not.to.be.ok();
            expect(spy2.called).to.be.ok();
        });

        it('should properly simulate bubbling of focus event', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onFocus : spy })
                    .setChildren(elem('input')));

            simulate.focusin(document.getElementById('id1'));

            expect(spy.called).to.be.ok();
        });

        it('should properly simulate bubbling of blur event', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ onBlur : spy }).setChildren(
                    elem('input').setAttrs({ id : 'id1' })));

            simulate.focus(document.getElementById('id1'));
            simulate.focusout(document.getElementById('id1'));

            expect(spy.called).to.be.ok();
        });

        it('should properly add handler when existing dom is adopted', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy();

            domNode.innerHTML= '<div><div><div id="id1"></div></div></div>';

            mountSync(
                domNode,
                elem('div').setAttrs({ onClick : spy1 }).setChildren(
                    elem('div').setAttrs({ onClick : spy2 }).setChildren(
                        elem('div').setAttrs({ id : 'id1' }))));

            simulate.click(document.getElementById('id1'));

            expect(spy1.called).to.be.ok();
            expect(spy2.called).to.be.ok();
        });
    });

    describe('non-bubbleable events', () => {
        it('should properly add handler', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ onScroll : spy1 }).setChildren([
                    elem('div').setAttrs({ id : 'id1', onScroll : spy2 }),
                    elem('div').setAttrs({ id : 'id2', onScroll : spy3 })
                ]));

            simulate.scroll(document.getElementById('id1'));

            expect(spy1.called).not.to.be.ok();
            expect(spy2.called).to.be.ok();
            expect(spy3.called).not.to.be.ok();
        });

        it('should properly call handler with SyntheticEvent object', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onScroll : spy }));

            simulate.scroll(document.getElementById('id1'));

            const e = spy.args[0][0];

            expect(e.type).to.be.equal('scroll');
        });

        it('should properly remove handler', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onScroll : spy }));

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1' }));

            simulate.scroll(document.getElementById('id1'));

            expect(spy.called).not.to.be.ok();
        });

        it('should properly replace handler for non-bubbleable events', () => {
            const spy1 = sinon.spy(),
                spy2 = sinon.spy();

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onScroll : spy1 }));

            mountSync(
                domNode,
                elem('div').setAttrs({ id : 'id1', onScroll : spy2 }));

            simulate.scroll(document.getElementById('id1'));

            expect(spy1.called).not.to.be.ok();
            expect(spy2.called).to.be.ok();
        });

        it('should properly reuse SyntheticEvent object', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div')
                    .setAttrs({ id : 'id1', onClick : spy })
                    .setChildren(elem('div').setAttrs({ id : 'id2', onClick : spy })));

            simulate.click(document.getElementById('id1'));
            simulate.click(document.getElementById('id2'));

            expect(spy.args[0][0]).to.equal(spy.args[1][0]);
            expect(spy.args[1][0].target).to.equal(document.getElementById('id2'));
        });

        it('shouldn\'t reuse persisted SyntheticEvent object', () => {
            const spy = sinon.spy();

            mountSync(
                domNode,
                elem('div')
                    .setAttrs({
                        id : 'id1',
                        onClick : e => { e.persist(); spy(e); }
                    }));

            simulate.click(document.getElementById('id1'));
            simulate.click(document.getElementById('id1'));

            expect(spy.args[0][0]).not.to.equal(spy.args[1][0]);
        });
    });
});
