import { node, mountToDomSync } from '../../src/vidom';

describe('patchDom', () => {
    describe('updateText', () => {
        it('should update node text', () => {
            const parentNode = node('span').children('text'),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('span').children('new text'));

            expect(domNode.textContent).to.equal('new text');
        });

        it('should update node html', () => {
            const parentNode = node('span').html('<span></span>'),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('span').html('<span></span><i></i>'));

            expect(domNode.childNodes.length).to.equal(2);
        });
    });

    describe('updateAttr', () => {
        it('should update node attribute', () => {
            const parentNode = node('textarea').attrs({ cols : 5 }),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('textarea').attrs({ cols : 3 }));

            expect(domNode.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', () => {
            const parentNode = node('input').attrs({ value : 'val' }),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('input').attrs({ value : 'new val' }));

            expect(domNode.value).to.equal('new val');
        });

        it('should keep value of input if type is changed', () => {
            const parentNode = node('input').attrs({ type : 'text', value : 'val' }),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('input').attrs({ type : 'checkbox', value : 'val' }));

            expect(domNode.value).to.equal('val');
        });

        it('should update select children', () => {
            const parentNode = node('select')
                    .attrs({ multiple : true, value : [1] })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 }),
                        node('option').attrs({ value : 3 })
                    ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('select')
                    .attrs({ multiple : true, value : [2, 3] })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 }),
                        node('option').attrs({ value : 3 })
                    ]));

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
            expect(domNode.childNodes[2].selected).to.equal(true);
        });
    });

    describe('removeAttr', () => {
        it('should remove node attribute', () => {
            const parentNode = node('textarea').attrs({ disabled : true }),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('textarea'));

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should remove node property', () => {
            const parentNode = node('input').attrs({ value : 'val' }),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('input'));

            expect(domNode.value).to.equal('');
        });

        it('should remove style node property', () => {
            const parentNode = node('div').attrs({ style : { width : '20px' } }),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('div'));
            expect(domNode.style).to.eql(document.createElement('div').style);
        });

        it('should update select children', () => {
            const parentNode = node('select')
                    .attrs({ value : 1 })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 })
                    ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('select')
                    .attrs({ multiple : true })
                    .children([
                        node('option').attrs({ value : 1 }),
                        node('option').attrs({ value : 2 })
                    ]));

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(false);
        });
    });

    describe('replace', () => {
        it('should replace node', () => {
            const oldNode = node('span'),
                parentNode = node('div').children([node('a'), oldNode]),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('div').children([node('a'), node('div')]));

            expect(domNode.childNodes[1].tagName)
                .to.equal('DIV');
        });

        it('should keep parent namespace', () => {
            const parentNode = node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node('circle'))),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('g').children(node('path'))));

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should replace fragment with single node', () => {
            const parentNode = node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('div').children([node('a'), node('span')]));

            expect(domNode.innerHTML)
                .to.equal('<a></a><span></span>');
        });

        it('should replace node with fragment', () => {
            const parentNode = node('div').children([node('a'), node('span')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]));

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });
    });

    describe('appendChild', () => {
        it('should append child node', () => {
            const parentNode = node('div').children([node('a'), node('span')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('div').children([node('a'), node('span'), node('div')]));

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[2].tagName).to.equal('DIV');
        });

        it('should keep parent namespace', () => {
            const parentNode = node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('circle')),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children([node('circle'), node('circle')]));

            expect(domNode.childNodes[1].namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should append child fragment', () => {
            const parentNode = node('div').children([node('a')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]));

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!---->');
        });

        it('should append child fragment to another one', () => {
            const parentNode = node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([
                        node('b'),
                        node('i')
                    ]),
                    node('u').key('c')
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([
                        node('b').key('a'),
                        node('i').key('b'),
                        node('fragment').key('c').children([
                            node('h1'),
                            node('h2')
                        ])
                    ]),
                    node('u').key('c')
                ]));

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><h1></h1><h2></h2><!----><!----><u></u>');
        });
    });

    describe('removeChild', () => {
        it('should remove child node', () => {
            const oldNode = node('span'),
                parentNode = node('div').children([node('a'), oldNode]),
                domNode = parentNode.renderToDom(),
                aDomNode = domNode.children[0];

            parentNode.patch(node('div').children(node('a')));

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.childNodes[0]).to.equal(aDomNode);
        });

        it('should remove child fragment', () => {
            const parentNode = node('div').children([
                    node('a'),
                    node('fragment').children([node('b'), node('i')])
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('div').children([node('a')]));

            expect(domNode.innerHTML).to.equal('<a></a>');
        });
    });

    describe('insertChild', () => {
        it('should insert child node', () => {
            const parentNode = node('div').children([node('a').key('a'), node('span').key('c')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('a').key('a'),
                    node('div').key('b'),
                    node('span').key('c')
                ]));

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });

        it('should keep parent namespace', () => {
            const parentNode = node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(node('circle').key('b')),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children([node('circle').key('a'), node('circle').key('b')]));

            expect(domNode.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });

        it('should insert child fragment', () => {
            const parentNode = node('div').children([
                    node('a').key('a'),
                    node('span').key('c')
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([node('b'), node('i')]),
                    node('span').key('c')
                ]));

            expect(domNode.innerHTML).to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should insert child fragment before another one', () => {
            const parentNode = node('div').children([
                    node('fragment').key('b').children([node('i'), node('u')])
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')])
                ]));

            expect(domNode.innerHTML).to.equal('<!----><a></a><b></b><!----><!----><i></i><u></u><!---->');
        });
    });

    describe('moveChild', () => {
        it('should move child node', () => {
            const aNode = node('a').key('a'),
                bNode = node('a').key('b'),
                parentNode = node('div').children([aNode, bNode]),
                domNode = parentNode.renderToDom(),
                aDomNode = domNode.children[0],
                bDomNode = domNode.children[1];

            parentNode.patch(node('div').children([bNode, aNode]));

            expect(domNode.childNodes.length).to.equal(2);
            expect(domNode.childNodes[0]).to.equal(bDomNode);
            expect(domNode.childNodes[1]).to.equal(aDomNode);
        });

        it('should keep focus', () => {
            const rootDomElement = document.createElement('div');

            document.body.appendChild(rootDomElement);

            mountToDomSync(rootDomElement, node('div').children([
                node('div').key(1).children([
                    node('input').attrs({ id : 'id1' }).key(1),
                    node('input').key(2)
                ]),
                node('div').key(2)
            ]));

            const activeElement = document.getElementById('id1');
            activeElement.focus();

            mountToDomSync(rootDomElement, node('div').children([
                node('div').key(2),
                node('div').key(1).children([
                    node('input').key(2),
                    node('input').attrs({ id : 'id1' }).key(1)
                ])
            ]));

            expect(document.activeElement).to.equal(activeElement);

            document.body.removeChild(rootDomElement);
        });

        it('should move child fragment', () => {
            const parentNode = node('div').children([
                    node('fragment').key('b').children([
                        node('b'),
                        node('i')
                    ]),
                    node('a').key('a'),
                    node('span').key('c')
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('a').key('a'),
                    node('fragment').key('b').children([node('b'), node('i')]),
                    node('span').key('c')
                ]));

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><b></b><i></i><!----><span></span>');
        });

        it('should move child fragment before another one', () => {
            const parentNode = node('div').children([
                    node('fragment').key('c').children([node('h1'), node('h2')]),
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')]),
                    node('fragment').key('d').children([node('h3'), node('h4')])
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')]),
                    node('fragment').key('c').children([node('h1'), node('h2')]),
                    node('fragment').key('e').children([node('h3'), node('h4')])
                ]));

            expect(domNode.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><i></i><u></u><!---->' +
                    '<!----><h1></h1><h2></h2><!----><!----><h3></h3><h4></h4><!---->');
        });

        it('should move child fragment after another one', () => {
            const parentNode = node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('b').children([node('i'), node('u')]),
                    node('fragment').key('c').children([node('h1'), node('h2')])
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('fragment').key('a').children([node('a'), node('b')]),
                    node('fragment').key('c').children([node('h1'), node('h2')]),
                    node('fragment').key('b').children([node('i'), node('u')])
                ]));

            expect(domNode.innerHTML)
                .to.equal(
                    '<!----><a></a><b></b><!----><!----><h1></h1><h2></h2><!----><!----><i></i><u></u><!---->');
        });
    });

    describe('removeChildren', () => {
        it('should remove children nodes', () => {
            const parentNode = node('div').children([node('a'), node('span')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(node('div'));

            expect(domNode.childNodes.length).to.equal(0);
        });

        it('should remove children nodes of fragment', () => {
            const parentNode = node('div').children([
                    node('a'),
                    node('fragment').children([node('a'), node('b')])
                ]),
                domNode = parentNode.renderToDom();

            parentNode.patch(
                node('div').children([
                    node('a'),
                    node('fragment')
                ]));

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><!---->');
        });
    });
});
