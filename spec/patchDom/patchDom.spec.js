import { node, mountSync, unmountSync } from '../../src/vidom';
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
            mountSync(domNode, node('span').setChildren('text'));
            mountSync(domNode, node('span').setChildren('new text'));

            expect(domNode.firstChild.textContent)
                .to.equal('new text');
        });

        it('should update node html', () => {
            mountSync(domNode, node('span').setHtml('<span></span>'));
            mountSync(domNode, node('span').setHtml('<span></span><i></i>'));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<span></span><i></i>');
        });

        it('should update empty text node', () => {
            mountSync(domNode, node('span').setChildren(node('text')));
            mountSync(domNode, node('span').setChildren(node('text').setChildren('text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->text<!---->');
        });

        it('should update not empty text node', () => {
            mountSync(domNode, node('span').setChildren(node('text').setChildren('text')));
            mountSync(domNode, node('span').setChildren(node('text').setChildren('new text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->new text<!---->');
        });
    });

    describe('removeText', () => {
        it('should remove node text', () => {
            mountSync(domNode, node('span').setChildren('text'));
            mountSync(domNode, node('span'));

            expect(domNode.firstChild.textContent)
                .to.equal('');
        });

        it('should remove text node text', () => {
            mountSync(domNode, node('span').setChildren(node('text').setChildren('text')));
            mountSync(domNode, node('span').setChildren(node('text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><!---->');
        });
    });

    describe('updateAttr', () => {
        it('should update node attribute', () => {
            mountSync(domNode, node('textarea').setAttrs({ cols : 5 }));
            mountSync(domNode, node('textarea').setAttrs({ cols : 3 }));

            expect(domNode.firstChild.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', () => {
            mountSync(domNode, node('input').setAttrs({ value : 'val' }));
            mountSync(domNode, node('input').setAttrs({ value : 'new val' }));

            expect(domNode.firstChild.value).to.equal('new val');
        });

        it('should keep value of input if type is changed', () => {
            mountSync(domNode, node('input').setAttrs({ type : 'text', value : 'val' }));
            mountSync(domNode, node('input').setAttrs({ type : 'checkbox', value : 'val' }));

            expect(domNode.firstChild.value).to.equal('val');
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                node('select')
                    .setAttrs({ multiple : true, value : [1] })
                    .setChildren([
                        node('option').setAttrs({ value : 1 }),
                        node('option').setAttrs({ value : 2 }),
                        node('option').setAttrs({ value : 3 })
                    ]));
            mountSync(
                domNode,
                node('select')
                    .setAttrs({ multiple : true, value : [2, 3] })
                    .setChildren([
                        node('option').setAttrs({ value : 1 }),
                        node('option').setAttrs({ value : 2 }),
                        node('option').setAttrs({ value : 3 })
                    ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).to.ok();
            expect(options[2].selected).to.ok();
        });
    });

    describe('removeAttr', () => {
        it('should remove node attribute', () => {
            mountSync(domNode, node('textarea').setAttrs({ disabled : true }));
            mountSync(domNode, node('textarea'));

            expect(domNode.firstChild.hasAttribute('disabled')).not.to.ok();
        });

        it('should remove node property', () => {
            mountSync(domNode, node('input').setAttrs({ value : 'val' }));
            mountSync(domNode, node('input'));

            expect(domNode.firstChild.value).to.equal('');
        });

        it('should remove style node property', () => {
            mountSync(domNode, node('div').setAttrs({ style : { width : '20px' } }));
            mountSync(domNode, node('div'));

            expect(domNode.firstChild.style).to.eql(document.createElement('div').style);
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                node('select')
                    .setAttrs({ value : 1 })
                    .setChildren([
                        node('option').setAttrs({ value : 1 }),
                        node('option').setAttrs({ value : 2 })
                    ]));
            mountSync(
                domNode,
                node('select')
                    .setAttrs({ multiple : true })
                    .setChildren([
                        node('option').setAttrs({ value : 1 }),
                        node('option').setAttrs({ value : 2 })
                    ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).not.to.ok();
        });
    });

    describe('replace', () => {
        it('should replace node', () => {
            mountSync(domNode, node('div').setChildren([node('a'), node('span')]));
            mountSync(domNode, node('div').setChildren([node('a'), node('div')]));

            expect(domNode.firstChild.childNodes[1].tagName.toLowerCase())
                .to.equal('div');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                node('svg')
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(node('g').setChildren(node('circle'))));
            mountSync(
                domNode,
                node('svg')
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(node('g').setChildren(node('path'))));

            expect(domNode.firstChild.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should replace fragment with single node', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a'),
                    node('fragment').setChildren([node('b'), node('i')])
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a'),
                    node('span')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });

        it('should replace node with fragment', () => {
            mountSync(domNode, node('div').setChildren([node('a'), node('span')]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a'),
                    node('fragment').setChildren([node('b'), node('i')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should replace node with text node', () => {
            mountSync(domNode, node('div').setChildren([node('a'), node('span')]));
            mountSync(domNode, node('div').setChildren([node('a'), node('text')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });

        it('should replace text node with node', () => {
            mountSync(domNode, node('div').setChildren([node('a'), node('text')]));
            mountSync(domNode, node('div').setChildren([node('a'), node('span')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });
    });

    describe('appendChild', () => {
        it('should append child node', () => {
            mountSync(domNode, node('div').setChildren([node('a'), node('span')]));
            mountSync(domNode, node('div').setChildren([node('a'), node('span'), node('div')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span><div></div>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                node('svg')
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(node('circle')));
            mountSync(
                domNode,
                node('svg')
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren([node('circle'), node('circle')]));

            expect(domNode.firstChild.childNodes[1].namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should append child fragment', () => {
            mountSync(domNode, node('div').setChildren([node('a')]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a'),
                    node('fragment').setChildren([node('b'), node('i')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should append child fragment to another one', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('fragment').setKey('b').setChildren([
                        node('b'),
                        node('i')
                    ]),
                    node('u').setKey('c')
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('fragment').setKey('b').setChildren([
                        node('b').setKey('a'),
                        node('i').setKey('b'),
                        node('fragment').setKey('c').setChildren([node('h1'), node('h2')])
                    ]),
                    node('u').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><h1></h1><h2></h2><!----><!----><u></u>');
        });
    });

    describe('removeChild', () => {
        it('should remove child node', () => {
            mountSync(domNode, node('div').setChildren([node('a'), node('span')]));
            mountSync(domNode, node('div').setChildren(node('a')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });

        it('should remove child fragment', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a'),
                    node('fragment').setChildren([node('b'), node('i')])
                ]));
            mountSync(domNode, node('div').setChildren([node('a')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });
    });

    describe('insertChild', () => {
        it('should insert child node', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('span').setKey('c')
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('div').setKey('b'),
                    node('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><div></div><span></span>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                node('svg')
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren(node('circle').setKey('b')));
            mountSync(
                domNode,
                node('svg')
                    .setNs('http://www.w3.org/2000/svg')
                    .setChildren([node('circle').setKey('a'), node('circle').setKey('b')]));

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should insert child fragment', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('span').setKey('c')
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('fragment').setKey('b').setChildren([node('b'), node('i')]),
                    node('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should insert child fragment before another one', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('fragment').setKey('b').setChildren([node('i'), node('u')])
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('fragment').setKey('a').setChildren([node('a'), node('b')]),
                    node('fragment').setKey('b').setChildren([node('i'), node('u')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><a></a><b></b><!----><!----><i></i><u></u><!---->');
        });
    });

    describe('moveChild', () => {
        it('should move child node', () => {
            mountSync(domNode, node('div').setChildren([node('a').setKey('a'), node('b').setKey('b')]));

            const aDomNode = domNode.firstChild.childNodes[0],
                bDomNode = domNode.firstChild.childNodes[1];

            mountSync(domNode, node('div').setChildren([node('b').setKey('b'), node('a').setKey('a')]));

            const { childNodes } = domNode.firstChild;

            expect(childNodes[0]).to.be.equal(bDomNode);
            expect(childNodes[1]).to.be.equal(aDomNode);
        });

        it('should keep focus and don\'t emit redundant onFocus/onBlur', () => {
            const onFocus = sinon.spy(),
                onBlur = sinon.spy();

            mountSync(
                domNode,
                node('div').setChildren([
                    node('div').setKey(1).setChildren([
                        node('input').setAttrs({ id : 'id1', onFocus, onBlur }).setKey(1),
                        node('input').setKey(2)
                    ]),
                    node('div').setKey(2)
                ]));

            const activeElement = document.getElementById('id1');

            activeElement.focus();

            mountSync(
                domNode,
                node('div').setChildren([
                    node('div').setKey(2),
                    node('div').setKey(1).setChildren([
                        node('input').setKey(2),
                        node('input').setAttrs({ id : 'id1', onFocus, onBlur }).setKey(1)
                    ])
                ]));

            expect(document.activeElement).to.equal(activeElement);
            expect(onFocus.calledOnce).to.be.ok();
            expect(onBlur.called).not.to.be.ok();
        });

        it('should move child fragment', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('fragment').setKey('b').setChildren([node('b'), node('i')]),
                    node('a').setKey('a'),
                    node('span').setKey('c')
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('fragment').setKey('b').setChildren([node('b'), node('i')]),
                    node('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should move child fragment before another one', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('fragment').setKey('c').setChildren([node('h1'), node('h2')]),
                    node('fragment').setKey('a').setChildren([node('a'), node('b')]),
                    node('fragment').setKey('b').setChildren([node('i'), node('u')]),
                    node('fragment').setKey('d').setChildren([node('h3'), node('h4')])
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('fragment').setKey('a').setChildren([node('a'), node('b')]),
                    node('fragment').setKey('b').setChildren([node('i'), node('u')]),
                    node('fragment').setKey('c').setChildren([node('h1'), node('h2')]),
                    node('fragment').setKey('e').setChildren([node('h3'), node('h4')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><i></i><u></u><!---->' +
                    '<!----><h1></h1><h2></h2><!----><!----><h3></h3><h4></h4><!---->');
        });

        it('should move child fragment after another one', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('fragment').setKey('a').setChildren([node('a'), node('b')]),
                    node('fragment').setKey('b').setChildren([node('i'), node('u')]),
                    node('fragment').setKey('c').setChildren([node('h1'), node('h2')])
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('fragment').setKey('a').setChildren([node('a'), node('b')]),
                    node('fragment').setKey('c').setChildren([node('h1'), node('h2')]),
                    node('fragment').setKey('b').setChildren([node('i'), node('u')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><h1></h1><h2></h2><!---->' +
                    '<!----><i></i><u></u><!---->');
        });

        it('should move text node', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('text').setKey('b').setChildren('text'),
                    node('a').setKey('a'),
                    node('span').setKey('c')
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a').setKey('a'),
                    node('text').setKey('b').setChildren('text'),
                    node('span').setKey('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!---->text<!----><span></span>');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('text').setKey('c').setChildren('c'),
                    node('text').setKey('a').setChildren('a'),
                    node('text').setKey('b').setChildren('b'),
                    node('text').setKey('d').setChildren('d')
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('text').setKey('a').setChildren('a'),
                    node('text').setKey('b').setChildren('b'),
                    node('text').setKey('c').setChildren('c'),
                    node('text').setKey('e').setChildren('e')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->b<!----><!---->c<!----><!---->e<!---->');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('text').setKey('a').setChildren('a'),
                    node('text').setKey('b').setChildren('b'),
                    node('text').setKey('c').setChildren('c')
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('text').setKey('a').setChildren('a'),
                    node('text').setKey('c').setChildren('c'),
                    node('text').setKey('b').setChildren('b')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->c<!----><!---->b<!---->');
        });
    });

    describe('removeChildren', () => {
        it('should remove children nodes', () => {
            mountSync(domNode, node('div').setChildren([node('a'), node('span')]));
            mountSync(domNode, node('div'));

            expect(domNode.firstChild.childNodes.length).to.equal(0);
        });

        it('should remove children nodes of fragment', () => {
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a'),
                    node('fragment').setChildren([node('a'), node('b')])
                ]));
            mountSync(
                domNode,
                node('div').setChildren([
                    node('a'),
                    node('fragment')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });
    });
});
