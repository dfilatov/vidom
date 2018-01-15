import { createComponent } from '../../src/vidom';
import { h } from '../helpers';

describe('renderToDom', () => {
    let topNode;

    afterEach(() => {
        topNode.unmount();
    });

    describe('tag', () => {
        it('should be rendered properly', () => {
            expect((topNode = h('span')).renderToDom(null).tagName).to.equal('SPAN');
        });
    });

    describe('ns', () => {
        it('should be rendered with default namespace', () => {
            expect((topNode = h('div')).renderToDom(null).namespaceURI)
                .to.equal('http://www.w3.org/1999/xhtml');
        });

        it('should be rendered with corresponding namespace', () => {
            expect((topNode = h('svg')).renderToDom(null).namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be inherited from parent', () => {
            const domNode = (topNode = h('svg', { children : h('g', { children : h('circle') }) }))
                .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            const domNode = (topNode = h('div', { children : [h('span'), h('img')] })).renderToDom(null);

            expect(domNode.children.length).to.equal(2);
            expect(domNode.children[0].tagName).to.equal('SPAN');
            expect(domNode.children[1].tagName).to.equal('IMG');
        });
    });

    describe('attrs', () => {
        it('should be rendered as attributes', () => {
            const domNode = (topNode = h('textarea', { cols : 5, rows : 2, disabled : true })).renderToDom(null);

            expect(domNode.getAttribute('cols')).to.equal('5');
            expect(domNode.getAttribute('rows')).to.equal('2');
            expect(domNode.hasAttribute('disabled')).to.equal(true);
        });

        it('shouldn\'t render falsy boolean attribute', () => {
            const domNode = (topNode = h('textarea', { disabled : false })).renderToDom(null);

            expect(domNode.hasAttribute('disabled')).to.equal(false);
        });

        it('should be rendered as properties', () => {
            const domNode = (topNode = h('input', { type : 'radio', checked : true })).renderToDom(null);
            expect(domNode.checked).to.equal(true);
        });

        it('should properly render style', () => {
            const domNode = (topNode = h('div', { style : { width : '100px', display : 'none' } })).renderToDom(null);

            expect(domNode.style.width).to.equal('100px');
            expect(domNode.style.display).to.equal('none');
        });

        it('shouldn\'t render null value', () => {
            const domNode = (topNode = h('input', { value : null })).renderToDom(null);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('shouldn\'t render undefined value', () => {
            const domNode = (topNode = h('input', { 'class' : undefined })).renderToDom(null);

            expect(domNode.className).to.equal('');
            expect(domNode.value).to.equal('');
        });

        it('should be rendered as data-attribute', () => {
            const domNode = (topNode = h('div', { 'data-id' : '123' })).renderToDom(null);

            expect(domNode.getAttribute('data-id')).to.equal('123');
        });

        it('should be rendered as custom attribute', () => {
            const domNode = (topNode = h('div', { 'custom-attr' : '123' })).renderToDom(null);

            expect(domNode.getAttribute('custom-attr')).to.equal('123');
        });

        it('should support alternative names', () => {
            const domNode = (topNode = h('div', { children : [
                h('label', { 'for' : 'id1', 'class' : 'c1' }),
                h('label', { htmlFor : 'id1', className : 'c1' })
            ] })).renderToDom(null);

            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
            expect(domNode.children[0].className).to.equal('c1');
            expect(domNode.children[0].getAttribute('for')).to.equal('id1');
        });
    });

    describe('text', () => {
        it('should be rendered as a wrapped text node', () => {
            const domNode = (topNode = h('span', { children : 'some text' })).renderToDom(null);

            expect(domNode.childNodes.length).to.equal(1);
            expect(domNode.textContent).to.equal('some text');
        });

        it('should not render booleans in a wrapped text node', () => {
            const domNode = (topNode = h('span', { children : true })).renderToDom(null);

            expect(domNode.childNodes.length).to.equal(0);
        });

        it('should be rendered as a plain text node', () => {
            const domNode = (topNode = h('div', { children : [
                h('plaintext', { children : 'text1' }),
                h('plaintext', { children : '' }),
                h('plaintext', { children : 'text2' })
            ] })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<!---->text1<!----><!----><!----><!---->text2<!---->');
        });

        it('should not render booleans in a plain text node', () => {
            const domNode = (topNode = h('div', { children : [
                h('plaintext', { children : true }),
                h('plaintext', { children : false })
            ] })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<!----><!----><!----><!---->');
        });
    });

    describe('html', () => {
        it('should be rendered as inner html', () => {
            const domNode = (topNode = h('span', { html : '<span></span><i></i>' })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<span></span><i></i>');
        });

        it('should not render "null"', () => {
            const domNode = (topNode = h('span', { html : null })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });

        it('should not render "undefined"', () => {
            const domNode = (topNode = h('span', { html : undefined })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });

        it('should not render "true"', () => {
            const domNode = (topNode = h('span', { html : true })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });

        it('should not render "false"', () => {
            const domNode = (topNode = h('span', { html : false })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('');
        });
    });

    describe('fragment', () => {
        it('should be rendered without own node', () => {
            const domNode = (topNode = h('div', { children : [
                h('a'),
                h('fragment', { children : [
                    h('i'),
                    h('fragment', { children : [
                        h('span'),
                        h('dl')
                    ] }),
                    h('img')] }),
                h('b')
            ] })).renderToDom(null);

            expect(domNode.innerHTML)
                .to.equal('<a></a><!----><i></i><!----><span></span><dl></dl><!----><img><!----><b></b>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            const domNode = (topNode = h('select', {
                value : 2,
                children : [
                    h('option', { value : 1 }),
                    h('option', { value : 2 })
                ]
            })).renderToDom(null);

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
        });

        it('should be properly rendered with multiple values', () => {
            const domNode = (topNode = h('select', {
                multiple : true,
                value : [2, 3],
                children : [
                    h('option', { value : 1 }),
                    h('option', { value : 2 }),
                    h('option', { value : 3 })
                ]
            })).renderToDom(null);

            expect(domNode.childNodes[0].selected).to.equal(false);
            expect(domNode.childNodes[1].selected).to.equal(true);
            expect(domNode.childNodes[2].selected).to.equal(true);
        });
    });

    describe('component', () => {
        it('should be rendered as component', () => {
            const Component = createComponent({
                    onRender() {
                        return h('div', {
                            ...this.attrs,
                            children : [
                                h('a'),
                                h('span')
                            ].concat(this.children)
                        });
                    }
                }),
                domNode = (topNode = h(Component, { id : 'id1', children : h('i') })).renderToDom(null);

            expect(domNode.tagName)
                .to.equal('DIV');
            expect(domNode.getAttribute('id'))
                .to.equal('id1');
            expect(domNode.children.length)
                .to.equal(3);
            expect(domNode.children[0].tagName)
                .to.equal('A');
            expect(domNode.children[1].tagName)
                .to.equal('SPAN');
            expect(domNode.children[2].tagName)
                .to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = createComponent({
                    onRender() {
                        return h('circle');
                    }
                }),
                domNode = (topNode = h('svg', { children : h('g', { children : h(Component) }) }))
                    .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be rendered as an empty comment if onRender() returns null', () => {
            const Component = createComponent({
                    onRender() {
                        return null;
                    }
                }),
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
            expect(domNode.data)
                .to.equal('');
        });

        it('should be rendered as an empty comment if onRender() returns undefined', () => {
            const Component = createComponent({
                    onRender() {
                        return undefined;
                    }
                }),
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
            expect(domNode.data)
                .to.equal('');
        });

        it('should be rendered as an empty comment if onRender() returns boolean', () => {
            const Component = createComponent({
                    onRender() {
                        return true;
                    }
                }),
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
            expect(domNode.data)
                .to.equal('');
        });

        it('should be rendered as a fragment if onRender() returns string', () => {
            const Component = createComponent({
                    onRender() {
                        return 'text';
                    }
                }),
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });

        it('should be rendered as a fragment if onRender() returns array', () => {
            const Component = createComponent({
                    onRender() {
                        return [h('div'), h('span')];
                    }
                }),
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, content) => {
                    return h('div', {
                        ...attrs,
                        children : [
                            h('a'),
                            h('span')
                        ].concat(content)
                    });
                },
                domNode = (topNode = h(Component, { id : 'id1', children : h('i') })).renderToDom(null);

            expect(domNode.tagName)
                .to.equal('DIV');
            expect(domNode.getAttribute('id'))
                .to.equal('id1');
            expect(domNode.children.length)
                .to.equal(3);
            expect(domNode.children[0].tagName)
                .to.equal('A');
            expect(domNode.children[1].tagName)
                .to.equal('SPAN');
            expect(domNode.children[2].tagName)
                .to.equal('I');
        });

        it('should pass parent namespace', () => {
            const Component = () => h('circle'),
                domNode = (topNode = h('svg', { children : h('g', { children : h(Component) }) }))
                    .renderToDom(null);

            expect(domNode.firstChild.firstChild.namespaceURI)
                .to.equal('http://www.w3.org/2000/svg');
        });

        it('should be rendered as any empty comment if it returns null', () => {
            const Component = () => null,
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
        });

        it('should be rendered as an empty comment if it returns undefined', () => {
            const Component = () => undefined,
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
        });

        it('should be rendered as an empty comment if it returns boolean', () => {
            const Component = () => true,
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.COMMENT_NODE);
        });

        it('should be rendered as a fragment if it returns string', () => {
            const Component = () => 'text',
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });

        it('should be rendered as a fragment if it returns array', () => {
            const Component = () => [h('div'), h('span')],
                domNode = (topNode = h(Component)).renderToDom(null);

            expect(domNode.nodeType)
                .to.equal(Node.DOCUMENT_FRAGMENT_NODE);
        });
    });
});
