import sinon from 'sinon';
import { h, mountSync, unmountSync } from '../../src/vidom';

describe('patchDom', () => {
    let domNode;

    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        unmountSync(domNode);
        document.body.removeChild(domNode);
    });

    describe('updateText', () => {
        it('should update node text', () => {
            mountSync(domNode, h('span', null, 'text'));
            mountSync(domNode, h('span', null, 'new text'));

            expect(domNode.firstChild.textContent)
                .to.equal('new text');
        });

        it('should update node html', () => {
            mountSync(domNode, h('span', { html : '<span></span>' }));
            mountSync(domNode, h('span', { html : '<span></span><i></i>' }));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<span></span><i></i>');
        });

        it('should update empty text node', () => {
            mountSync(domNode, h('span', null, h('plaintext')));
            mountSync(domNode, h('span', null, h('plaintext', null, 'text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->text<!---->');
        });

        it('should update not empty text node', () => {
            mountSync(domNode, h('span', null, h('plaintext', null, 'text')));
            mountSync(domNode, h('span', null, h('plaintext', null, 'new text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->new text<!---->');
        });
    });

    describe('removeText', () => {
        it('should remove node text', () => {
            mountSync(domNode, h('span', null, 'text'));
            mountSync(domNode, h('span'));

            expect(domNode.firstChild.textContent)
                .to.equal('');
        });

        it('should remove text node text', () => {
            mountSync(domNode, h('span', null, h('plaintext', null, 'text')));
            mountSync(domNode, h('span', null, h('plaintext')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><!---->');
        });
    });

    describe('updateAttr', () => {
        it('should update node attribute', () => {
            mountSync(domNode, h('textarea', { cols : 5 }));
            mountSync(domNode, h('textarea', { cols : 3 }));

            expect(domNode.firstChild.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', () => {
            mountSync(domNode, h('input', { value : 'val' }));
            mountSync(domNode, h('input', { value : 'new val' }));

            expect(domNode.firstChild.value).to.equal('new val');
        });

        it('should keep value of input if type is changed', () => {
            mountSync(domNode, h('input', { type : 'text', value : 'val' }));
            mountSync(domNode, h('input', { type : 'checkbox', value : 'val' }));

            expect(domNode.firstChild.value).to.equal('val');
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                h('select', { multiple : true, value : [1] }, [
                    h('option', { value : 1 }),
                    h('option', { value : 2 }),
                    h('option', { value : 3 })
                ]));
            mountSync(
                domNode,
                h('select', { multiple : true, value : [2, 3] }, [
                    h('option', { value : 1 }),
                    h('option', { value : 2 }),
                    h('option', { value : 3 })
                ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).to.ok();
            expect(options[2].selected).to.ok();
        });
    });

    describe('removeAttr', () => {
        it('should remove node attribute', () => {
            mountSync(domNode, h('textarea', { disabled : true }));
            mountSync(domNode, h('textarea'));

            expect(domNode.firstChild.hasAttribute('disabled')).not.to.ok();
        });

        it('should remove node property', () => {
            mountSync(domNode, h('input', { value : 'val' }));
            mountSync(domNode, h('input'));

            expect(domNode.firstChild.value).to.equal('');
        });

        it('should remove style node property', () => {
            mountSync(domNode, h('div', { style : { width : '20px' } }));
            mountSync(domNode, h('div'));

            expect(domNode.firstChild.style).to.eql(document.createElement('div').style);
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                h('select', { value : 1 }, [
                    h('option', { value : 1 }),
                    h('option', { value : 2 })
                ]));
            mountSync(
                domNode,
                h('select', { multiple : true }, [
                    h('option', { value : 1 }),
                    h('option', { value : 2 })
                ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).not.to.ok();
        });
    });

    describe('replace', () => {
        it('should replace node', () => {
            mountSync(domNode, h('div', null, h('a'), h('span')));
            mountSync(domNode, h('div', null, h('a'), h('div')));

            expect(domNode.firstChild.childNodes[1].tagName.toLowerCase())
                .to.equal('div');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                h('svg', null, h('g', null, h('circle'))));
            mountSync(
                domNode,
                h('svg', null, h('g', null, h('path'))));

            expect(domNode.firstChild.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should replace fragment with single node', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('a'),
                    h('fragment', null, h('b'), h('i'))
                ]));
            mountSync(
                domNode,
                h('div', null, h('a'), h('span')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });

        it('should replace node with fragment', () => {
            mountSync(domNode, h('div', null, h('a'), h('span')));
            mountSync(
                domNode,
                h('div', null, [
                    h('a'),
                    h('fragment', null, h('b'), h('i'))
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should replace node with text node', () => {
            mountSync(domNode, h('div', null, h('a'), h('span')));
            mountSync(domNode, h('div', null, h('a'), h('plaintext')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });

        it('should replace text node with node', () => {
            mountSync(domNode, h('div', null, h('a'), h('plaintext')));
            mountSync(domNode, h('div', null, h('a'), h('span')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });
    });

    describe('appendChild', () => {
        it('should append child node', () => {
            mountSync(domNode, h('div', null, h('a'), h('span')));
            mountSync(domNode, h('div', null, h('a'), h('span'), h('div')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span><div></div>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                h('svg', null, h('circle')));
            mountSync(
                domNode,
                h('svg', null, h('circle'), h('circle')));

            expect(domNode.firstChild.childNodes[1].namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should append child fragment', () => {
            mountSync(domNode, h('div', null, [h('a')]));
            mountSync(
                domNode,
                h('div', null, [
                    h('a'),
                    h('fragment', null, h('b'), h('i'))
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should append child fragment to another one', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('fragment', { key : 'b'}, h('b'), h('i')),
                    h('u', { key : 'c' })
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('fragment', { key : 'b'}, [
                        h('b', { key : 'a' }),
                        h('i', { key : 'b' }),
                        h('fragment', { key : 'c' }, h('h1'), h('h2'))
                    ]),
                    h('u', { key : 'c' })
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><h1></h1><h2></h2><!----><!----><u></u>');
        });
    });

    describe('removeChild', () => {
        it('should remove child node', () => {
            mountSync(domNode, h('div', null, h('a'), h('span')));
            mountSync(domNode, h('div', null, h('a')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });

        it('should remove child fragment', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('a'),
                    h('fragment', null, h('b'), h('i'))
                ]));
            mountSync(domNode, h('div', null, [h('a')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });
    });

    describe('insertChild', () => {
        it('should insert child node', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('span', { key : 'c' })
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('div', { key : 'b' }),
                    h('span', { key : 'c' })
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><div></div><span></span>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                h('svg', null, h('circle', { key : 'b' })));
            mountSync(
                domNode,
                h('svg', null, h('circle', { key : 'a' }), h('circle', { key : 'b' })));

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should insert child fragment', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('span', { key : 'c' })
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('fragment', { key : 'b'}, h('b'), h('i')),
                    h('span', { key : 'c' })
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should insert child fragment before another one', () => {
            mountSync(
                domNode,
                h('div', null, h('fragment', { key : 'b' }, h('i'), h('u'))));
            mountSync(
                domNode,
                h('div', null, [
                    h('fragment', { key : 'a' }, h('a'), h('b')),
                    h('fragment', { key : 'b' }, h('i'), h('u'))
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><a></a><b></b><!----><!----><i></i><u></u><!---->');
        });
    });

    describe('moveChild', () => {
        it('should move child node', () => {
            mountSync(domNode, h('div', null, h('a', { key : 'a' }), h('b', { key : 'b' })));

            const aDomNode = domNode.firstChild.childNodes[0],
                bDomNode = domNode.firstChild.childNodes[1];

            mountSync(domNode, h('div', null, h('b', { key : 'b' }), h('a', { key : 'a' })));

            const { childNodes } = domNode.firstChild;

            expect(childNodes[0]).to.be.equal(bDomNode);
            expect(childNodes[1]).to.be.equal(aDomNode);
        });

        it('should keep focus and don\'t emit redundant onFocus/onBlur', () => {
            const onFocus = sinon.spy(),
                onBlur = sinon.spy();

            mountSync(
                domNode,
                h('div', null, [
                    h('div', { key : 1 }, [
                        h('input', { key : 1, id : 'id1', onFocus, onBlur }),
                        h('input', { key : 2 })
                    ]),
                    h('div', { key : 2 })
                ]));

            const activeElement = document.getElementById('id1');

            activeElement.focus();

            mountSync(
                domNode,
                h('div', null, [
                    h('div', { key : 2 }),
                    h('div', { key : 1 }, [
                        h('input', { key : 2 }),
                        h('input', { key : 1, id : 'id1', onFocus, onBlur })
                    ])
                ]));

            expect(document.activeElement).to.equal(activeElement);
            expect(onFocus.calledOnce).to.be.ok();
            expect(onBlur.called).not.to.be.ok();
        });

        it('should move child fragment', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('fragment', { key : 'b' }, h('b'), h('i')),
                    h('a', { key : 'a' }),
                    h('span', { key : 'c' })
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('fragment', { key : 'b' }, h('b'), h('i')),
                    h('span', { key : 'c' })
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should move child fragment before another one', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('fragment', { key : 'c' }, h('h1'), h('h2')),
                    h('fragment', { key : 'a' }, h('a'), h('b')),
                    h('fragment', { key : 'b' }, h('i'), h('u')),
                    h('fragment', { key : 'd' }, h('h3'), h('h4'))
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('fragment', { key : 'a' }, h('a'), h('b')),
                    h('fragment', { key : 'b' }, h('i'), h('u')),
                    h('fragment', { key : 'c' }, h('h1'), h('h2')),
                    h('fragment', { key : 'e' }, h('h3'), h('h4'))
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><i></i><u></u><!---->' +
                    '<!----><h1></h1><h2></h2><!----><!----><h3></h3><h4></h4><!---->');
        });

        it('should move child fragment after another one', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('fragment', { key : 'a' }, h('a'), h('b')),
                    h('fragment', { key : 'b' }, h('i'), h('u')),
                    h('fragment', { key : 'c' }, h('h1'), h('h2'))
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('fragment', { key : 'a' }, h('a'), h('b')),
                    h('fragment', { key : 'c' }, h('h1'), h('h2')),
                    h('fragment', { key : 'b' }, h('i'), h('u'))
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><h1></h1><h2></h2><!---->' +
                    '<!----><i></i><u></u><!---->');
        });

        it('should move text node', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('plaintext', { key : 'b' }, 'text'),
                    h('a', { key : 'a' }),
                    h('span', { key : 'c' })
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('a', { key : 'a' }),
                    h('plaintext', { key : 'b' }, 'text'),
                    h('span', { key : 'c' })
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!---->text<!----><span></span>');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('plaintext', { key : 'c' }, 'c'),
                    h('plaintext', { key : 'a' }, 'a'),
                    h('plaintext', { key : 'b' }, 'b'),
                    h('plaintext', { key : 'd' }, 'd')
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('plaintext', { key : 'a' }, 'a'),
                    h('plaintext', { key : 'b' }, 'b'),
                    h('plaintext', { key : 'c' }, 'c'),
                    h('plaintext', { key : 'e' }, 'e')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->b<!----><!---->c<!----><!---->e<!---->');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('plaintext', { key : 'a' }, 'a'),
                    h('plaintext', { key : 'b' }, 'b'),
                    h('plaintext', { key : 'c' }, 'c')
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('plaintext', { key : 'a' }, 'a'),
                    h('plaintext', { key : 'c' }, 'c'),
                    h('plaintext', { key : 'b' }, 'b')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->c<!----><!---->b<!---->');
        });
    });

    describe('removeChildren', () => {
        it('should remove children nodes', () => {
            mountSync(domNode, h('div', null, [h('a'), h('span')]));
            mountSync(domNode, h('div'));

            expect(domNode.firstChild.childNodes.length).to.equal(0);
        });

        it('should remove children nodes of fragment', () => {
            mountSync(
                domNode,
                h('div', null, [
                    h('a'),
                    h('fragment', null, h('a'), h('b'))
                ]));
            mountSync(
                domNode,
                h('div', null, [
                    h('a'),
                    h('fragment')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });
    });
});
