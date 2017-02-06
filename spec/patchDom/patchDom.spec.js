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
            mountSync(domNode, node('span').children('text'));
            mountSync(domNode, node('span').children('new text'));

            expect(domNode.firstChild.textContent)
                .to.equal('new text');
        });

        it('should update node html', () => {
            mountSync(domNode, node('span').html('<span></span>'));
            mountSync(domNode, node('span').html('<span></span><i></i>'));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<span></span><i></i>');
        });

        it('should update empty text node', () => {
            mountSync(domNode, node('span').children(node('text')));
            mountSync(domNode, node('span').children(node('text').children('text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->text<!---->');
        });

        it('should update not empty text node', () => {
            mountSync(domNode, node('span').children(node('text').children('text')));
            mountSync(domNode, node('span').children(node('text').children('new text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->new text<!---->');
        });
    });

    describe('removeText', () => {
        it('should remove node text', () => {
            mountSync(domNode, node('span').children('text'));
            mountSync(domNode, node('span'));

            expect(domNode.firstChild.textContent)
                .to.equal('');
        });

        it('should remove text node text', () => {
            mountSync(domNode, node('span').children(node('text').children('text')));
            mountSync(domNode, node('span').children(node('text')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><!---->');
        });
    });

    describe('updateAttr', () => {
        it('should update node attribute', () => {
            mountSync(domNode, node('textarea').attrs({ cols : 5 }));
            mountSync(domNode, node('textarea').attrs({ cols : 3 }));

            expect(domNode.firstChild.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', () => {
            mountSync(domNode, node('input').attrs({ value : 'val' }));
            mountSync(domNode, node('input').attrs({ value : 'new val' }));

            expect(domNode.firstChild.value).to.equal('new val');
        });

        it('should keep value of input if type is changed', () => {
            mountSync(domNode, node('input').attrs({ type : 'text', value : 'val' }));
            mountSync(domNode, node('input').attrs({ type : 'checkbox', value : 'val' }));

            expect(domNode.firstChild.value).to.equal('val');
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                node('select')
                    .attrs({ multiple : true, value : [1] })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 }),
                        node('option').attrs({ value : 3 })
                    ]));
            mountSync(
                domNode,
                node('select')
                    .attrs({ multiple : true, value : [2, 3] })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 }),
                        node('option').attrs({ value : 3 })
                    ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).to.ok();
            expect(options[2].selected).to.ok();
        });
    });

    describe('removeAttr', () => {
        it('should remove node attribute', () => {
            mountSync(domNode, node('textarea').attrs({ disabled : true }));
            mountSync(domNode, node('textarea'));

            expect(domNode.firstChild.hasAttribute('disabled')).not.to.ok();
        });

        it('should remove node property', () => {
            mountSync(domNode, node('input').attrs({ value : 'val' }));
            mountSync(domNode, node('input'));

            expect(domNode.firstChild.value).to.equal('');
        });

        it('should remove style node property', () => {
            mountSync(domNode, node('div').attrs({ style : { width : '20px' } }));
            mountSync(domNode, node('div'));

            expect(domNode.firstChild.style).to.eql(document.createElement('div').style);
        });

        it('should update select children', () => {
            mountSync(
                domNode,
                node('select')
                    .attrs({ value : 1 })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 })
                    ]));
            mountSync(
                domNode,
                node('select')
                    .attrs({ multiple : true })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 })
                    ]));

            const { options } = domNode.firstChild;

            expect(options[0].selected).not.to.ok();
            expect(options[1].selected).not.to.ok();
        });
    });

    describe('replace', () => {
        it('should replace node', () => {
            mountSync(domNode, node('div').children([node('a'), node('span')]));
            mountSync(domNode, node('div').children([node('a'), node('div')]));

            expect(domNode.firstChild.childNodes[1].tagName.toLowerCase())
                .to.equal('div');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node('circle'))));
            mountSync(
                domNode,
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node('path'))));

            expect(domNode.firstChild.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should replace fragment with single node', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('a'),
                    node('span')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });

        it('should replace node with fragment', () => {
            mountSync(domNode, node('div').children([node('a'), node('span')]));
            mountSync(
                domNode,
                node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should replace node with text node', () => {
            mountSync(domNode, node('div').children([node('a'), node('span')]));
            mountSync(domNode, node('div').children([node('a'), node('text')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });

        it('should replace text node with node', () => {
            mountSync(domNode, node('div').children([node('a'), node('text')]));
            mountSync(domNode, node('div').children([node('a'), node('span')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span>');
        });
    });

    describe('appendChild', () => {
        it('should append child node', () => {
            mountSync(domNode, node('div').children([node('a'), node('span')]));
            mountSync(domNode, node('div').children([node('a'), node('span'), node('div')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><span></span><div></div>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('circle')));
            mountSync(
                domNode,
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children([node('circle'), node('circle')]));

            expect(domNode.firstChild.childNodes[1].namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should append child fragment', () => {
            mountSync(domNode, node('div').children([node('a')]));
            mountSync(
                domNode,
                node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should append child fragment to another one', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([
                        node('b'),
                        node('i')
                    ]),
                    node('u').key('c')
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([
                        node('b').key('a'),
                        node('i').key('b'),
                        node('fragment').key('c').children([node('h1'), node('h2')])
                    ]),
                    node('u').key('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><h1></h1><h2></h2><!----><!----><u></u>');
        });
    });

    describe('removeChild', () => {
        it('should remove child node', () => {
            mountSync(domNode, node('div').children([node('a'), node('span')]));
            mountSync(domNode, node('div').children(node('a')));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });

        it('should remove child fragment', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]));
            mountSync(domNode, node('div').children([node('a')]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a>');
        });
    });

    describe('insertChild', () => {
        it('should insert child node', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('span').key('c')
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('div').key('b'),
                    node('span').key('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><div></div><span></span>');
        });

        it('should keep parent namespace', () => {
            mountSync(
                domNode,
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('circle').key('b')));
            mountSync(
                domNode,
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children([node('circle').key('a'), node('circle').key('b')]));

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should insert child fragment', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('span').key('c')
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([node('b'), node('i')]),
                    node('span').key('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should insert child fragment before another one', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('fragment').key('b').children([node('i'), node('u')])
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!----><a></a><b></b><!----><!----><i></i><u></u><!---->');
        });
    });

    describe('moveChild', () => {
        it('should move child node', () => {
            mountSync(domNode, node('div').children([node('a').key('a'), node('b').key('b')]));

            const aDomNode = domNode.firstChild.childNodes[0],
                bDomNode = domNode.firstChild.childNodes[1];

            mountSync(domNode, node('div').children([node('b').key('b'), node('a').key('a')]));

            const { childNodes } = domNode.firstChild;

            expect(childNodes[0]).to.be.equal(bDomNode);
            expect(childNodes[1]).to.be.equal(aDomNode);
        });

        it('should keep focus and don\'t emit redundant onFocus/onBlur', () => {
            const onFocus = sinon.spy(),
                onBlur = sinon.spy();

            mountSync(
                domNode,
                node('div').children([
                    node('div').key(1).children([
                        node('input').attrs({ id : 'id1', onFocus, onBlur }).key(1),
                        node('input').key(2)
                    ]),
                    node('div').key(2)
                ]));

            const activeElement = document.getElementById('id1');

            activeElement.focus();

            mountSync(
                domNode,
                node('div').children([
                    node('div').key(2),
                    node('div').key(1).children([
                        node('input').key(2),
                        node('input').attrs({ id : 'id1', onFocus, onBlur }).key(1)
                    ])
                ]));

            expect(document.activeElement).to.equal(activeElement);
            expect(onFocus.calledOnce).to.be.ok();
            expect(onBlur.called).not.to.be.ok();
        });

        it('should move child fragment', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('fragment').key('b').children([node('b'), node('i')]),
                    node('a').key('a'),
                    node('span').key('c')
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([node('b'), node('i')]),
                    node('span').key('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should move child fragment before another one', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('fragment').key('c').children([node('h1'), node('h2')]),
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')]),
                    node('fragment').key('d').children([node('h3'), node('h4')])
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')]),
                    node('fragment').key('c').children([node('h1'), node('h2')]),
                    node('fragment').key('e').children([node('h3'), node('h4')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><i></i><u></u><!---->' +
                    '<!----><h1></h1><h2></h2><!----><!----><h3></h3><h4></h4><!---->');
        });

        it('should move child fragment after another one', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')]),
                    node('fragment').key('c').children([node('h1'), node('h2')])
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('c').children([node('h1'), node('h2')]),
                    node('fragment').key('b').children([node('i'), node('u')])
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><h1></h1><h2></h2><!---->' +
                    '<!----><i></i><u></u><!---->');
        });

        it('should move text node', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('text').key('b').children('text'),
                    node('a').key('a'),
                    node('span').key('c')
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('a').key('a'),
                    node('text').key('b').children('text'),
                    node('span').key('c')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!---->text<!----><span></span>');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('text').key('c').children('c'),
                    node('text').key('a').children('a'),
                    node('text').key('b').children('b'),
                    node('text').key('d').children('d')
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('text').key('a').children('a'),
                    node('text').key('b').children('b'),
                    node('text').key('c').children('c'),
                    node('text').key('e').children('e')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->b<!----><!---->c<!----><!---->e<!---->');
        });

        it('should move text node before another one', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('text').key('a').children('a'),
                    node('text').key('b').children('b'),
                    node('text').key('c').children('c')
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('text').key('a').children('a'),
                    node('text').key('c').children('c'),
                    node('text').key('b').children('b')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<!---->a<!----><!---->c<!----><!---->b<!---->');
        });
    });

    describe('removeChildren', () => {
        it('should remove children nodes', () => {
            mountSync(domNode, node('div').children([node('a'), node('span')]));
            mountSync(domNode, node('div'));

            expect(domNode.firstChild.childNodes.length).to.equal(0);
        });

        it('should remove children nodes of fragment', () => {
            mountSync(
                domNode,
                node('div').children([
                    node('a'),
                    node('fragment').children([node('a'), node('b')])
                ]));
            mountSync(
                domNode,
                node('div').children([
                    node('a'),
                    node('fragment')
                ]));

            expect(domNode.firstChild.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });
    });
});
