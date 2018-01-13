import { elem, mountSync, unmountSync } from '../../src/vidom';
import sinon from 'sinon';

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
            mountSync(domNode, elem('span').setChildren('text'));
            mountSync(domNode, elem('span').setChildren('new text'));

            expect(domNode.firstChild.textContent)
                .to.equal('new text');
        });

        it('should update node html', () => {
            mountSync(domNode, elem('span').setHtml('<span></span>'));
            mountSync(domNode, elem('span').setHtml('<span></span><i></i>'));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<span></span><i></i>');
        });

        it('should update empty text node', () => {
            mountSync(domNode, elem('span').setChildren(elem('plaintext')));
            mountSync(domNode, elem('span').setChildren(elem('plaintext').setChildren('text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->text<!---->');
        });

        it('should update not empty text node', () => {
            mountSync(domNode, elem('span').setChildren(elem('plaintext').setChildren('text')));
            mountSync(domNode, elem('span').setChildren(elem('plaintext').setChildren('new text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->new text<!---->');
        });
    });

    describe('removeText', () => {
        it('should remove node text', () => {
            mountSync(domNode, elem('span').setChildren('text'));
            mountSync(domNode, elem('span'));

            expect(domNode.firstChild.textContent)
                .to.equal('');
        });

        it('should remove text node text', () => {
            mountSync(domNode, elem('span').setChildren(elem('plaintext').setChildren('text')));
            mountSync(domNode, elem('span').setChildren(elem('plaintext')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><!---->');
        });
    });

    describe('updateAttr', () => {
        it('should update node attribute', () => {
            mountSync(domNode, elem('textarea').setAttrs({ cols : 5 }));
            mountSync(domNode, elem('textarea').setAttrs({ cols : 3 }));

            expect(domNode.firstChild.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', () => {
            mountSync(domNode, elem('input').setAttrs({ value : 'val' }));
            mountSync(domNode, elem('input').setAttrs({ value : 'new val' }));

            expect(domNode.firstChild.value).to.equal('new val');
        });

        it('should keep value of input if type is changed', () => {
            mountSync(domNode, elem('input').setAttrs({ type : 'text', value : 'val' }));
            mountSync(domNode, elem('input').setAttrs({ type : 'checkbox', value : 'val' }));

            expect(domNode.firstChild.value).to.equal('val');
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                elem('select')
                    .setAttrs({ multiple : true, value : [1] })
                    .setChildren([
                        elem('option').setAttrs({ value : 1 }),
                        elem('option').setAttrs({ value : 2 }),
                        elem('option').setAttrs({ value : 3 })
                    ]));
            mountSync(
                domNode,
                elem('select')
                    .setAttrs({ multiple : true, value : [2, 3] })
                    .setChildren([
                        elem('option').setAttrs({ value : 1 }),
                        elem('option').setAttrs({ value : 2 }),
                        elem('option').setAttrs({ value : 3 })
                    ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).to.ok();
            expect(options[2].selected).to.ok();
        });
    });

    describe('removeAttr', () => {
        it('should remove node attribute', () => {
            mountSync(domNode, elem('textarea').setAttrs({ disabled : true }));
            mountSync(domNode, elem('textarea'));

            expect(domNode.firstChild.hasAttribute('disabled')).not.to.ok();
        });

        it('should remove node property', () => {
            mountSync(domNode, elem('input').setAttrs({ value : 'val' }));
            mountSync(domNode, elem('input'));

            expect(domNode.firstChild.value).to.equal('');
        });

        it('should remove style node property', () => {
            mountSync(domNode, elem('div').setAttrs({ style : { width : '20px' } }));
            mountSync(domNode, elem('div'));

            expect(domNode.firstChild.style).to.eql(document.createElement('div').style);
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                elem('select')
                    .setAttrs({ value : 1 })
                    .setChildren([
                        elem('option').setAttrs({ value : 1 }),
                        elem('option').setAttrs({ value : 2 })
                    ]));
            mountSync(
                domNode,
                elem('select')
                    .setAttrs({ multiple : true })
                    .setChildren([
                        elem('option').setAttrs({ value : 1 }),
                        elem('option').setAttrs({ value : 2 })
                    ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).not.to.ok();
        });
    });

    describe('replace', () => {
        it('should replace node', () => {
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span')]));
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('div')]));

            expect(domNode.firstChild.childNodes[1].tagName.toLowerCase())
                .to.equal('div');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                elem('svg')
                    .setChildren(elem('g').setChildren(elem('circle'))));
            mountSync(
                domNode,
                elem('svg')
                    .setChildren(elem('g').setChildren(elem('path'))));

            expect(domNode.firstChild.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should replace fragment with single node', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a'),
                    elem('fragment').setChildren([elem('b'), elem('i')])
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a'),
                    elem('span')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });

        it('should replace node with fragment', () => {
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span')]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a'),
                    elem('fragment').setChildren([elem('b'), elem('i')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should replace node with text node', () => {
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span')]));
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('plaintext')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });

        it('should replace text node with node', () => {
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('plaintext')]));
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });
    });

    describe('appendChild', () => {
        it('should append child node', () => {
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span')]));
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span'), elem('div')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span><div></div>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                elem('svg')
                    .setChildren(elem('circle')));
            mountSync(
                domNode,
                elem('svg')
                    .setChildren([elem('circle'), elem('circle')]));

            expect(domNode.firstChild.childNodes[1].namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should append child fragment', () => {
            mountSync(domNode, elem('div').setChildren([elem('a')]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a'),
                    elem('fragment').setChildren([elem('b'), elem('i')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should append child fragment to another one', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('fragment').setKey('b').setChildren([
                        elem('b'),
                        elem('i')
                    ]),
                    elem('u').setKey('c')
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('fragment').setKey('b').setChildren([
                        elem('b').setKey('a'),
                        elem('i').setKey('b'),
                        elem('fragment').setKey('c').setChildren([elem('h1'), elem('h2')])
                    ]),
                    elem('u').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><h1></h1><h2></h2><!----><!----><u></u>');
        });
    });

    describe('removeChild', () => {
        it('should remove child node', () => {
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span')]));
            mountSync(domNode, elem('div').setChildren(elem('a')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });

        it('should remove child fragment', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a'),
                    elem('fragment').setChildren([elem('b'), elem('i')])
                ]));
            mountSync(domNode, elem('div').setChildren([elem('a')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });
    });

    describe('insertChild', () => {
        it('should insert child node', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('span').setKey('c')
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('div').setKey('b'),
                    elem('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><div></div><span></span>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                elem('svg')
                    .setChildren(elem('circle').setKey('b')));
            mountSync(
                domNode,
                elem('svg')
                    .setChildren([elem('circle').setKey('a'), elem('circle').setKey('b')]));

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should insert child fragment', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('span').setKey('c')
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('fragment').setKey('b').setChildren([elem('b'), elem('i')]),
                    elem('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should insert child fragment before another one', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('fragment').setKey('b').setChildren([elem('i'), elem('u')])
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('fragment').setKey('a').setChildren([elem('a'), elem('b')]),
                    elem('fragment').setKey('b').setChildren([elem('i'), elem('u')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><a></a><b></b><!----><!----><i></i><u></u><!---->');
        });
    });

    describe('moveChild', () => {
        it('should move child node', () => {
            mountSync(domNode, elem('div').setChildren([elem('a').setKey('a'), elem('b').setKey('b')]));

            const aDomNode = domNode.firstChild.childNodes[0],
                bDomNode = domNode.firstChild.childNodes[1];

            mountSync(domNode, elem('div').setChildren([elem('b').setKey('b'), elem('a').setKey('a')]));

            const { childNodes } = domNode.firstChild;

            expect(childNodes[0]).to.be.equal(bDomNode);
            expect(childNodes[1]).to.be.equal(aDomNode);
        });

        it('should keep focus and don\'t emit redundant onFocus/onBlur', () => {
            const onFocus = sinon.spy(),
                onBlur = sinon.spy();

            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('div').setKey(1).setChildren([
                        elem('input').setAttrs({ id : 'id1', onFocus, onBlur }).setKey(1),
                        elem('input').setKey(2)
                    ]),
                    elem('div').setKey(2)
                ]));

            const activeElement = document.getElementById('id1');

            activeElement.focus();

            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('div').setKey(2),
                    elem('div').setKey(1).setChildren([
                        elem('input').setKey(2),
                        elem('input').setAttrs({ id : 'id1', onFocus, onBlur }).setKey(1)
                    ])
                ]));

            expect(document.activeElement).to.equal(activeElement);
            expect(onFocus.calledOnce).to.be.ok();
            expect(onBlur.called).not.to.be.ok();
        });

        it('should move child fragment', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('fragment').setKey('b').setChildren([elem('b'), elem('i')]),
                    elem('a').setKey('a'),
                    elem('span').setKey('c')
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('fragment').setKey('b').setChildren([elem('b'), elem('i')]),
                    elem('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should move child fragment before another one', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('fragment').setKey('c').setChildren([elem('h1'), elem('h2')]),
                    elem('fragment').setKey('a').setChildren([elem('a'), elem('b')]),
                    elem('fragment').setKey('b').setChildren([elem('i'), elem('u')]),
                    elem('fragment').setKey('d').setChildren([elem('h3'), elem('h4')])
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('fragment').setKey('a').setChildren([elem('a'), elem('b')]),
                    elem('fragment').setKey('b').setChildren([elem('i'), elem('u')]),
                    elem('fragment').setKey('c').setChildren([elem('h1'), elem('h2')]),
                    elem('fragment').setKey('e').setChildren([elem('h3'), elem('h4')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><i></i><u></u><!---->' +
                    '<!----><h1></h1><h2></h2><!----><!----><h3></h3><h4></h4><!---->');
        });

        it('should move child fragment after another one', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('fragment').setKey('a').setChildren([elem('a'), elem('b')]),
                    elem('fragment').setKey('b').setChildren([elem('i'), elem('u')]),
                    elem('fragment').setKey('c').setChildren([elem('h1'), elem('h2')])
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('fragment').setKey('a').setChildren([elem('a'), elem('b')]),
                    elem('fragment').setKey('c').setChildren([elem('h1'), elem('h2')]),
                    elem('fragment').setKey('b').setChildren([elem('i'), elem('u')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><h1></h1><h2></h2><!---->' +
                    '<!----><i></i><u></u><!---->');
        });

        it('should move text node', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('plaintext').setKey('b').setChildren('text'),
                    elem('a').setKey('a'),
                    elem('span').setKey('c')
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a').setKey('a'),
                    elem('plaintext').setKey('b').setChildren('text'),
                    elem('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!---->text<!----><span></span>');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('plaintext').setKey('c').setChildren('c'),
                    elem('plaintext').setKey('a').setChildren('a'),
                    elem('plaintext').setKey('b').setChildren('b'),
                    elem('plaintext').setKey('d').setChildren('d')
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('plaintext').setKey('a').setChildren('a'),
                    elem('plaintext').setKey('b').setChildren('b'),
                    elem('plaintext').setKey('c').setChildren('c'),
                    elem('plaintext').setKey('e').setChildren('e')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->b<!----><!---->c<!----><!---->e<!---->');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('plaintext').setKey('a').setChildren('a'),
                    elem('plaintext').setKey('b').setChildren('b'),
                    elem('plaintext').setKey('c').setChildren('c')
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('plaintext').setKey('a').setChildren('a'),
                    elem('plaintext').setKey('c').setChildren('c'),
                    elem('plaintext').setKey('b').setChildren('b')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->c<!----><!---->b<!---->');
        });
    });

    describe('removeChildren', () => {
        it('should remove children nodes', () => {
            mountSync(domNode, elem('div').setChildren([elem('a'), elem('span')]));
            mountSync(domNode, elem('div'));

            expect(domNode.firstChild.childNodes.length).to.equal(0);
        });

        it('should remove children nodes of fragment', () => {
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a'),
                    elem('fragment').setChildren([elem('a'), elem('b')])
                ]));
            mountSync(
                domNode,
                elem('div').setChildren([
                    elem('a'),
                    elem('fragment')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });
    });
});
