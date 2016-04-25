import createNode from '../../src/createNode';
import { mountToDomSync } from '../../src/client/mounter';

describe('patchDom', () => {
    describe('updateText', () => {
        it('should update node text', () => {
            const node = createNode('span').children('text'),
                domNode = node.renderToDom();

            node.patch(createNode('span').children('new text'));

            expect(domNode.textContent).to.equal('new text');
        });

        it('should update node html', () => {
            const node = createNode('span').html('<span></span>'),
                domNode = node.renderToDom();

            node.patch(createNode('span').html('<span></span><i></i>'));

            expect(domNode.childNodes.length).to.equal(2);
        });
    });

    describe('updateAttr', () => {
        it('should update node attribute', () => {
            const node = createNode('textarea').attrs({ cols : 5 }),
                domNode = node.renderToDom();

            node.patch(createNode('textarea').attrs({ cols : 3 }));

            expect(domNode.getAttribute('cols')).to.equal('3');
        });

        it('should update node property', () => {
            const node = createNode('input').attrs({ value : 'val' }),
                domNode = node.renderToDom();

            node.patch(createNode('input').attrs({ value : 'new val' }));

            expect(domNode.value).to.equal('new val');
        });

        it('should keep value of input if type is changed', () => {
            const node = createNode('input').attrs({ type : 'text', value : 'val' }),
                domNode = node.renderToDom();

            node.patch(createNode('input').attrs({ type : 'checkbox', value : 'val' }));

            expect(domNode.value).to.equal('val');
        });

        it('should update select children', () => {
            const node = createNode('select')
                    .attrs({ multiple : true, value : [1] })
                    .children([
                        createNode('option').attrs({ value : 1 }),
                        createNode('option').attrs({ value : 2 }),
                        createNode('option').attrs({ value : 3 })
                    ]),
                domNode = node.renderToDom();

            node.patch(createNode('select')
                .attrs({ multiple : true, value : [2, 3] })
                .children([
                    createNode('option').attrs({ value : 1 }),
                    createNode('option').attrs({ value : 2 }),
                    createNode('option').attrs({ value : 3 })
                ]));

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
            expect(domNode.childNodes[2].selected).to.equal(true);
        });
    });

    describe('removeAttr', () => {
        it('should remove node attribute', () => {
            const node = createNode('textarea').attrs({ disabled : true }),
                domNode = node.renderToDom();

            node.patch(createNode('textarea'));

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should remove node property', () => {
            const node = createNode('input').attrs({ value : 'val' }),
                domNode = node.renderToDom();

            node.patch(createNode('input'));

            expect(domNode.value).to.equal('');
        });

        it('should remove style node property', () => {
            const node = createNode('div').attrs({ style : { width : '20px' } }),
                domNode = node.renderToDom();

            node.patch(createNode('div'));
            expect(domNode.style).to.eql(document.createElement('div').style);
        });

        it('should update select children', () => {
            const node = createNode('select')
                    .attrs({ value : 1 })
                    .children([
                        createNode('option').attrs({ value : 1 }),
                        createNode('option').attrs({ value : 2 })
                    ]),
                domNode = node.renderToDom();

            node.patch(createNode('select')
                .attrs({ multiple : true })
                .children([
                    createNode('option').attrs({ value : 1 }),
                    createNode('option').attrs({ value : 2 })
                ]));

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(false);
        });
    });

    describe('replace', () => {
        it('should replace node', () => {
            const oldNode = createNode('span'),
                parentNode = createNode('div').children([createNode('a'), oldNode]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div').children([createNode('a'), createNode('div')]));

            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });

        it('should keep parent namespace', () => {
            const node = createNode('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(createNode('g').children(createNode('circle'))),
                domNode = node.renderToDom();

            node.patch(createNode('svg')
                .ns('http://www.w3.org/2000/svg')
                .children(createNode('g').children(createNode('path'))));

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('appendChild', () => {
        it('should append child node', () => {
            const parentNode = createNode('div').children([createNode('a'), createNode('span')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div').children([createNode('a'), createNode('span'), createNode('div')]));

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[2].tagName).to.equal('DIV');
        });

        it('should keep parent namespace', () => {
            const parentNode = createNode('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(createNode('circle')),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('svg')
                .ns('http://www.w3.org/2000/svg')
                .children([createNode('circle'), createNode('circle')]));

            expect(domNode.childNodes[1].namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('removeChild', () => {
        it('should remove child node', () => {
            const oldNode = createNode('span'),
                parentNode = createNode('div').children([createNode('a'), oldNode]),
                domNode = parentNode.renderToDom(),
                aDomNode = domNode.children[0];

            parentNode.patch(createNode('div').children(createNode('a')));

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.childNodes[0]).to.equal(aDomNode);
        });
    });

    describe('insertChild', () => {
        it('should insert child node', () => {
            const parentNode = createNode('div').children([createNode('a').key('a'), createNode('span').key('c')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div').children([
                createNode('a').key('a'),
                createNode('div').key('b'),
                createNode('span').key('c')
            ]));

            expect(domNode.childNodes.length).to.equal(3);
            expect(domNode.childNodes[1].tagName).to.equal('DIV');
        });

        it('should keep parent namespace', () => {
            const parentNode = createNode('svg')
                    .ns('http://www.w3.org/2000/svg')
                    .children(createNode('circle').key('b')),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('svg')
                .ns('http://www.w3.org/2000/svg')
                .children([createNode('circle').key('a'), createNode('circle').key('b')]));

            expect(domNode.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('moveChild', () => {
        it('should move child node', () => {
            const aNode = createNode('a').key('a'),
                bNode = createNode('a').key('b'),
                parentNode = createNode('div').children([aNode, bNode]),
                domNode = parentNode.renderToDom(),
                aDomNode = domNode.children[0],
                bDomNode = domNode.children[1];

            parentNode.patch(createNode('div').children([bNode, aNode]));

            expect(domNode.childNodes.length).to.equal(2);
            expect(domNode.childNodes[0]).to.equal(bDomNode);
            expect(domNode.childNodes[1]).to.equal(aDomNode);
        });

        it('should keep focus', () => {
            const rootDomElement = document.createElement('div');

            document.body.appendChild(rootDomElement);

            mountToDomSync(rootDomElement, createNode('div').children([
                createNode('div').key(1).children([
                    createNode('input').attrs({ id : 'id1' }).key(1),
                    createNode('input').key(2)
                ]),
                createNode('div').key(2)
            ]));

            const activeElement = document.getElementById('id1');
            activeElement.focus();

            mountToDomSync(rootDomElement, createNode('div').children([
                createNode('div').key(2),
                createNode('div').key(1).children([
                    createNode('input').key(2),
                    createNode('input').attrs({ id : 'id1' }).key(1)
                ])
            ]));

            expect(document.activeElement).to.equal(activeElement);

            document.body.removeChild(rootDomElement);
        });
    });

    describe('removeChildren', () => {
        it('should remove children nodes', () => {
            const parentNode = createNode('div').children([createNode('a'), createNode('span')]),
                domNode = parentNode.renderToDom();

            parentNode.patch(createNode('div'));

            expect(domNode.childNodes.length).to.equal(0);
        });
    });
});
