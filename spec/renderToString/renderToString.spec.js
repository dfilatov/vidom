import createNode from '../../src/createNode';
import createComponent from '../../src/createComponent';

describe('renderToString', () => {
    describe('tag', () => {
        it('should be rendered properly', () => {
            expect(createNode('span').renderToString())
                .to.equal('<span></span>');
        });

        it('should be rendered as short tag', () => {
            expect(createNode('img').renderToString())
                .to.equal('<img/>');
        });
    });

    describe('ns', () => {
        it('should be rendered with given namespace', () => {
            expect(createNode('svg').setNs('http://www.w3.org/2000/svg').renderToString())
                .to.equal('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            expect(createNode('div').setChildren([createNode('span'), createNode('img')]).renderToString())
                .to.equal('<div><span></span><img/></div>');
        });
    });

    describe('attrs', () => {
        it('should be rendered properly', () => {
            expect(createNode('input').setAttrs({ type : 'text', id : 'id1', value : 'v1' }).renderToString())
                .to.equal('<input type="text" id="id1" value="v1"/>');
        });

        it('should be rendered properly for boolean attributes', () => {
            expect(createNode('input').setAttrs({ checked : true, disabled : true }).renderToString())
                .to.equal('<input checked disabled/>');
        });

        it('should be rendered properly for overloaded with "true" attribute', () => {
            expect(createNode('a').setAttrs({ download : true }).renderToString())
                .to.equal('<a download></a>');
        });

        it('should be rendered properly for overloaded with "false" attribute', () => {
            expect(createNode('a').setAttrs({ download : false }).renderToString())
                .to.equal('<a></a>');
        });

        it('shouldn\'t render null value', () => {
            expect(createNode('input').setAttrs({ value : null }).renderToString())
                .to.equal('<input/>');
        });

        it('shouldn\'t render undefined value', () => {
            expect(createNode('input').setAttrs({ className : undefined }).renderToString())
                .to.equal('<input/>');
        });

        it('shouldn\'t render event handlers', () => {
            expect(createNode('div').setAttrs({ onClick : () => {} }).renderToString())
                .to.equal('<div></div>');
        });

        it('should not be rendered if boolean attribute is false', () => {
            expect(createNode('input').setAttrs({ checked : false }).renderToString())
                .to.equal('<input/>');
        });

        it('should properly render style', () => {
            expect(createNode('div').setAttrs({ style : { width : '100px', 'border-color' : 'red' } }).renderToString())
                .to.equal('<div style="width:100px;border-color:red;"></div>');
        });

        it('should properly render camelized style', () => {
            expect(createNode('div').setAttrs({ style : { borderLeftWidth : '5px' } }).renderToString())
                .to.equal('<div style="border-left-width:5px;"></div>');
        });

        it('should be rendered as data-attribute', () => {
            expect(createNode('div').setAttrs({ 'data-id' : '123' }).renderToString())
                .to.equal('<div data-id="123"></div>');
        });

        it('should be rendered as custom attribute', () => {
            expect(createNode('div').setAttrs({ 'custom-attr' : '123' }).renderToString())
                .to.equal('<div custom-attr="123"></div>');
        });

        it('should support alternative names', () => {
            expect(createNode('div').setAttrs({ className : 'c1', tabIndex : 4 }).renderToString())
                .to.equal('<div class="c1" tabindex="4"></div>');
        });

        it('should properly render textarea value', () => {
            expect(createNode('textarea').setAttrs({ value : 'val' }).renderToString())
                .to.equal('<textarea>val</textarea>');
        });

        it('should escape values', () => {
            expect(createNode('textarea').setAttrs({ className : '"&' }).renderToString())
                .to.equal('<textarea class="&quot;&amp;"></textarea>');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            expect(createNode('span').setChildren('some text').renderToString())
                .to.equal('<span>some text</span>');
        });

        it('should escape html', () => {
            expect(createNode('span').setChildren('<&/>').renderToString())
                .to.equal('<span>&lt;&amp;/&gt;</span>');
        });

        it('should be rendered as a text node', () => {
            expect(createNode('plaintext').setChildren('text').renderToString())
                .to.equal('<!---->text<!---->');
        });
    });

    describe('html', () => {
        it('should be rendered without escaping', () => {
            expect(createNode('span').setHtml('<span></span><i></i>').renderToString())
                .to.equal('<span><span></span><i></i></span>');
        });
    });

    describe('fragment', () => {
        it('should be rendered as fragment', () => {
            expect(createNode('div').setChildren([
                createNode('a'),
                createNode('fragment').setChildren([
                    createNode('i'),
                    createNode('fragment').setChildren(createNode('u')),
                    createNode('span')
                ]),
                createNode('b')
            ]).renderToString())
                .to.equal('<div><a></a><!----><i></i><!----><u></u><!----><span></span><!----><b></b></div>');
        });

        it('should be rendered as comment if no children', () => {
            expect(createNode('div').setChildren([
                createNode('a'),
                createNode('fragment'),
                createNode('b')
            ]).renderToString())
                .to.equal('<div><a></a><!----><!----><b></b></div>');
        });
    });

    describe('select', () => {
        it('should be properly rendered', () => {
            expect(
                createNode('select')
                    .setAttrs({ value : 2 })
                    .setChildren([
                        createNode('option').setAttrs({ value : 1 }),
                        createNode('option').setAttrs({ value : 2 })
                    ])
                    .renderToString())
                .to.equal('<select><option value="1"></option><option selected value="2"></option></select>');
        });

        it('should be properly rendered with multiple values', () => {
            expect(
                createNode('select')
                    .setAttrs({ multiple : true, value : [2, 3] })
                    .setChildren([
                        createNode('group').setChildren([
                            createNode('option').setAttrs({ value : 1 }),
                            createNode('option').setAttrs({ value : 2 }),
                            createNode('option').setAttrs({ value : 3 })
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
                onRender : function() {
                    return createNode('div').setAttrs(this.attrs).setChildren([
                        createNode('a'),
                        createNode('span')
                    ].concat(this.children));
                }
            });

            expect(createNode(Component).setAttrs({ id : 'id1' }).setChildren(createNode('i')).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>');
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = createComponent({
                onRender() {
                    return null;
                }
            });

            expect(createNode(Component).renderToString())
                .to.equal('<!---->');
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, content) => {
                return createNode('div').setAttrs(attrs).setChildren([
                    createNode('a'),
                    createNode('span')
                ].concat(content));
            };

            expect(createNode(Component).setAttrs({ id : 'id1' }).setChildren(createNode('i')).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>');
        });

        it('should render comment if returns nothing', () => {
            const Component = () => {};

            expect(createNode(Component).renderToString())
                .to.equal('<!---->');
        });
    });
});
