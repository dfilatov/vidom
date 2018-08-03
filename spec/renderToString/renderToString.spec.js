import { createComponent } from '../../src/vidom';
import { h } from '../helpers';

describe('renderToString', () => {
    describe('tag', () => {
        it('should be rendered properly', () => {
            expect(h('span').renderToString())
                .to.equal('<span></span>');
        });

        it('should be rendered as short tag', () => {
            expect(h('img').renderToString())
                .to.equal('<img/>');
        });
    });

    describe('ns', () => {
        it('should be rendered with given namespace', () => {
            expect(h('svg').renderToString())
                .to.equal('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            expect(h('div', { children : [h('span'), h('img')] }).renderToString())
                .to.equal('<div><span></span><img/></div>');
        });
    });

    describe('attrs', () => {
        it('should be rendered properly', () => {
            expect(h('input', { type : 'text', id : 'id1', value : 'v1' }).renderToString())
                .to.equal('<input type="text" id="id1" value="v1"/>');
        });

        it('should be rendered properly for boolean attributes', () => {
            expect(h('input', { checked : true, disabled : true }).renderToString())
                .to.equal('<input checked disabled/>');
        });

        it('should be rendered properly for overloaded with "true" attribute', () => {
            expect(h('a', { download : true }).renderToString())
                .to.equal('<a download></a>');
        });

        it('should be rendered properly for overloaded with "false" attribute', () => {
            expect(h('a', { download : false }).renderToString())
                .to.equal('<a></a>');
        });

        it('shouldn\'t render null value', () => {
            expect(h('input', { value : null }).renderToString())
                .to.equal('<input/>');
        });

        it('shouldn\'t render undefined value', () => {
            expect(h('input', { className : undefined }).renderToString())
                .to.equal('<input/>');
        });

        it('shouldn\'t render event handlers', () => {
            expect(h('div', { onClick : () => {} }).renderToString())
                .to.equal('<div></div>');
        });

        it('should not be rendered if boolean attribute is false', () => {
            expect(h('input', { checked : false }).renderToString())
                .to.equal('<input/>');
        });

        it('should properly render style', () => {
            expect(h('div', { style : { width : '100px', 'border-color' : 'red' } }).renderToString())
                .to.equal('<div style="width:100px;border-color:red;"></div>');
        });

        it('should properly render camelized style', () => {
            expect(h('div', { style : { borderLeftWidth : '5px' } }).renderToString())
                .to.equal('<div style="border-left-width:5px;"></div>');
        });

        it('should be rendered as data-attribute', () => {
            expect(h('div', { 'data-id' : '123' }).renderToString())
                .to.equal('<div data-id="123"></div>');
        });

        it('should be rendered as custom attribute', () => {
            expect(h('div', { 'custom-attr' : '123' }).renderToString())
                .to.equal('<div custom-attr="123"></div>');
        });

        it('should support alternative names', () => {
            expect(h('div', { className : 'c1', tabIndex : 4 }).renderToString())
                .to.equal('<div class="c1" tabindex="4"></div>');
        });

        it('should properly render textarea value', () => {
            expect(h('textarea', { value : 'val' }).renderToString())
                .to.equal('<textarea>val</textarea>');
        });

        it('should escape values', () => {
            expect(h('textarea', { className : '"&' }).renderToString())
                .to.equal('<textarea class="&quot;&amp;"></textarea>');
        });

        it('shouldn\'t render attributes with invalid names', () => {
            expect(h('div', { '> ' : 'val' }).renderToString())
                .to.equal('<div></div>');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            expect(h('span', { children : 'some text' }).renderToString())
                .to.equal('<span>some text</span>');
        });

        it('should escape html', () => {
            expect(h('span', { children : '<&/>' }).renderToString())
                .to.equal('<span>&lt;&amp;/&gt;</span>');
        });

        it('should be rendered as a text node', () => {
            expect(h('plaintext', { children : 'text' }).renderToString())
                .to.equal('<!---->text<!---->');
        });
    });

    describe('html', () => {
        it('should be rendered without escaping', () => {
            expect(h('span', { html : '<span></span><i></i>' }).renderToString())
                .to.equal('<span><span></span><i></i></span>');
        });
    });

    describe('fragment', () => {
        it('should be rendered as fragment', () => {
            expect(h('div', { children : [
                h('a'),
                h('fragment', { children : [
                    h('i'),
                    h('fragment', { children : h('u') }),
                    h('span')
                ] }),
                h('b')
            ] }).renderToString())
                .to.equal('<div><a></a><!----><i></i><!----><u></u><!----><span></span><!----><b></b></div>');
        });

        it('should be rendered as comment if no children', () => {
            expect(h('div', { children : [
                h('a'),
                h('fragment'),
                h('b')
            ] }).renderToString())
                .to.equal('<div><a></a><!----><!----><b></b></div>');
        });

        it('should be rendered if only string child', () => {
            expect(h('div', { children : [
                h('a'),
                h('fragment', { children : 'test' }),
                h('b')
            ] }).renderToString())
                .to.equal('<div><a></a><!----><!---->test<!----><!----><b></b></div>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            expect(
                h('select', {
                    value : 2,
                    children : [
                        h('option', { value : 1 }),
                        h('option', { value : 2 })
                    ]
                }).renderToString()
            )
                .to.equal('<select><option value="1"></option><option selected value="2"></option></select>');
        });

        it('should be properly rendered with multiple values', () => {
            expect(
                h('select', {
                    multiple : true,
                    value : [2, 3],
                    children : [
                        h('group', { children : [
                            h('option', { value : 1 }),
                            h('option', { value : 2 }),
                            h('option', { value : 3 })
                        ] })
                    ]
                }).renderToString()
            )
                .to.equal(
                    '<select multiple>' +
                        '<group>' +
                            '<option value="1"></option>' +
                            '<option selected value="2"></option>' +
                            '<option selected value="3"></option>' +
                        '</group>' +
                    '</select>');
        });
    });

    describe('component', () => {
        it('should be rendered as component', () => {
            const Component = createComponent({
                onRender() {
                    return h('div', {
                        ...this.attrs,
                        children : [h('a'), h('span')].concat(this.children)
                    });
                }
            });

            expect(h(Component, { id : 'id1', children : h('i') }).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>');
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = createComponent({
                onRender() {
                    return null;
                }
            });

            expect(h(Component).renderToString())
                .to.equal('<!---->');
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, children) => {
                return h('div', {
                    ...attrs,
                    children : [h('a'), h('span')].concat(children)
                });
            };

            expect(h(Component, { id : 'id1', children : h('i') }).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>');
        });

        it('should render comment if returns null', () => {
            const Component = () => null;

            expect(h(Component).renderToString())
                .to.equal('<!---->');
        });
    });
});
