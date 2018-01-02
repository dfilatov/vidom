import { elem, createComponent } from '../../src/vidom';

describe('renderToString', () => {
    describe('tag', () => {
        it('should be rendered properly', () => {
            expect(elem('span').renderToString())
                .to.equal('<span></span>');
        });

        it('should be rendered as short tag', () => {
            expect(elem('img').renderToString())
                .to.equal('<img/>');
        });
    });

    describe('ns', () => {
        it('should be rendered with given namespace', () => {
            expect(elem('svg').setNs('http://www.w3.org/2000/svg').renderToString())
                .to.equal('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            expect(elem('div').setChildren([elem('span'), elem('img')]).renderToString())
                .to.equal('<div><span></span><img/></div>');
        });
    });

    describe('attrs', () => {
        it('should be rendered properly', () => {
            expect(elem('input').setAttrs({ type : 'text', id : 'id1', value : 'v1' }).renderToString())
                .to.equal('<input type="text" id="id1" value="v1"/>');
        });

        it('should be rendered properly for boolean attributes', () => {
            expect(elem('input').setAttrs({ checked : true, disabled : true }).renderToString())
                .to.equal('<input checked disabled/>');
        });

        it('should be rendered properly for overloaded with "true" attribute', () => {
            expect(elem('a').setAttrs({ download : true }).renderToString())
                .to.equal('<a download></a>');
        });

        it('should be rendered properly for overloaded with "false" attribute', () => {
            expect(elem('a').setAttrs({ download : false }).renderToString())
                .to.equal('<a></a>');
        });

        it('shouldn\'t render null value', () => {
            expect(elem('input').setAttrs({ value : null }).renderToString())
                .to.equal('<input/>');
        });

        it('shouldn\'t render undefined value', () => {
            expect(elem('input').setAttrs({ className : undefined }).renderToString())
                .to.equal('<input/>');
        });

        it('shouldn\'t render event handlers', () => {
            expect(elem('div').setAttrs({ onClick : () => {} }).renderToString())
                .to.equal('<div></div>');
        });

        it('should not be rendered if boolean attribute is false', () => {
            expect(elem('input').setAttrs({ checked : false }).renderToString())
                .to.equal('<input/>');
        });

        it('should properly render style', () => {
            expect(elem('div').setAttrs({ style : { width : '100px', 'border-color' : 'red' } }).renderToString())
                .to.equal('<div style="width:100px;border-color:red;"></div>');
        });

        it('should properly render camelized style', () => {
            expect(elem('div').setAttrs({ style : { borderLeftWidth : '5px' } }).renderToString())
                .to.equal('<div style="border-left-width:5px;"></div>');
        });

        it('should be rendered as data-attribute', () => {
            expect(elem('div').setAttrs({ 'data-id' : '123' }).renderToString())
                .to.equal('<div data-id="123"></div>');
        });

        it('should be rendered as custom attribute', () => {
            expect(elem('div').setAttrs({ 'custom-attr' : '123' }).renderToString())
                .to.equal('<div custom-attr="123"></div>');
        });

        it('should support alternative names', () => {
            expect(elem('div').setAttrs({ className : 'c1', tabIndex : 4 }).renderToString())
                .to.equal('<div class="c1" tabindex="4"></div>');
        });

        it('should properly render textarea value', () => {
            expect(elem('textarea').setAttrs({ value : 'val' }).renderToString())
                .to.equal('<textarea>val</textarea>');
        });

        it('should escape values', () => {
            expect(elem('textarea').setAttrs({ className : '"&' }).renderToString())
                .to.equal('<textarea class="&quot;&amp;"></textarea>');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            expect(elem('span').setChildren('some text').renderToString())
                .to.equal('<span>some text</span>');
        });

        it('should escape html', () => {
            expect(elem('span').setChildren('<&/>').renderToString())
                .to.equal('<span>&lt;&amp;/&gt;</span>');
        });

        it('should be rendered as a text node', () => {
            expect(elem('plaintext').setChildren('text').renderToString())
                .to.equal('<!---->text<!---->');
        });
    });

    describe('html', () => {
        it('should be rendered without escaping', () => {
            expect(elem('span').setHtml('<span></span><i></i>').renderToString())
                .to.equal('<span><span></span><i></i></span>');
        });
    });

    describe('fragment', () => {
        it('should be rendered as fragment', () => {
            expect(elem('div').setChildren([
                elem('a'),
                elem('fragment').setChildren([
                    elem('i'),
                    elem('fragment').setChildren(elem('u')),
                    elem('span')
                ]),
                elem('b')
            ]).renderToString())
                .to.equal('<div><a></a><!----><i></i><!----><u></u><!----><span></span><!----><b></b></div>');
        });

        it('should be rendered as comment if no children', () => {
            expect(elem('div').setChildren([
                elem('a'),
                elem('fragment'),
                elem('b')
            ]).renderToString())
                .to.equal('<div><a></a><!----><!----><b></b></div>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            expect(
                elem('select')
                    .setAttrs({ value : 2 })
                    .setChildren([
                        elem('option').setAttrs({ value : 1 }),
                        elem('option').setAttrs({ value : 2 })
                    ])
                    .renderToString())
                .to.equal('<select><option value="1"></option><option selected value="2"></option></select>');
        });

        it('should be properly rendered with multiple values', () => {
            expect(
                elem('select')
                    .setAttrs({ multiple : true, value : [2, 3] })
                    .setChildren([
                        elem('group').setChildren([
                            elem('option').setAttrs({ value : 1 }),
                            elem('option').setAttrs({ value : 2 }),
                            elem('option').setAttrs({ value : 3 })
                        ])
                    ])
                    .renderToString())
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
                    return elem('div').setAttrs(this.attrs).setChildren([
                        elem('a'),
                        elem('span')
                    ].concat(this.children));
                }
            });

            expect(elem(Component).setAttrs({ id : 'id1' }).setChildren(elem('i')).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>');
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = createComponent({
                onRender() {
                    return null;
                }
            });

            expect(elem(Component).renderToString())
                .to.equal('<!---->');
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, content) => {
                return elem('div').setAttrs(attrs).setChildren([
                    elem('a'),
                    elem('span')
                ].concat(content));
            };

            expect(elem(Component).setAttrs({ id : 'id1' }).setChildren(elem('i')).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>');
        });

        it('should render comment if returns null', () => {
            const Component = () => null;

            expect(elem(Component).renderToString())
                .to.equal('<!---->');
        });
    });
});
