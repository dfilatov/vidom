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
            expect(createNode('svg').ns('http://www.w3.org/2000/svg').renderToString())
                .to.equal('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        });
    });

    describe('children', () => {
        it('should be rendered as child nodes', () => {
            expect(createNode('div').children([createNode('span'), createNode('img')]).renderToString())
                .to.equal('<div><span></span><img/></div>');
        });
    });

    describe('attrs', () => {
        it('should be rendered properly', () => {
            expect(createNode('input').attrs({ type : 'text', id : 'id1', value : 'v1' }).renderToString())
                .to.equal('<input type="text" id="id1" value="v1"/>');
        });

        it('should be rendered properly for boolean attribues', () => {
            expect(createNode('input').attrs({ checked : true, disabled : true }).renderToString())
                .to.equal('<input checked disabled/>')
        });

        it('shouldn\'t render null value', () => {
            expect(createNode('input').attrs({ value : null }).renderToString())
                .to.equal('<input/>')
        });

        it('shouldn\'t render undefined value', () => {
            expect(createNode('input').attrs({ className : undefined }).renderToString())
                .to.equal('<input/>')
        });

        it('should not be rendered if boolean attribute is false', () => {
            expect(createNode('input').attrs({ checked : false }).renderToString())
                .to.equal('<input/>')
        });

        it('should properly render style', () => {
            expect(createNode('div').attrs({ style : { width : '100px', 'border-color' : 'red' } }).renderToString())
                .to.equal('<div style="width:100px;border-color:red;"></div>');
        });

        it('should properly render camelized style', () => {
            expect(createNode('div').attrs({ style : { borderLeftWidth : '5px' } }).renderToString())
                .to.equal('<div style="border-left-width:5px;"></div>');
        });

        it('should be rendered as data-attribute', () => {
            expect(createNode('div').attrs({ 'data-id' : '123' }).renderToString())
                .to.equal('<div data-id="123"></div>');
        });

        it('should be rendered as custom attribute', () => {
            expect(createNode('div').attrs({ 'custom-attr' : '123' }).renderToString())
                .to.equal('<div custom-attr="123"></div>');
        });

        it('should support alternative names', () => {
            expect(createNode('div').attrs({ className : 'c1', tabIndex : 4 }).renderToString())
                .to.equal('<div class="c1" tabindex="4"></div>');
        });

        it('should properly render textarea value', () => {
            expect(createNode('textarea').attrs({ value : 'val' }).renderToString())
                .to.equal('<textarea>val</textarea>');
        });

        it('should escape values', () => {
            expect(createNode('textarea').attrs({ className : '"&' }).renderToString())
                .to.equal('<textarea class="&quot;&amp;"></textarea>');
        });
    });

    describe('text', () => {
        it('should be rendered as wrapped text node', () => {
            expect(createNode('span').children('some text').renderToString())
                .to.equal('<span>some text</span>');
        });

        it('should escape html', () => {
            expect(createNode('span').children('<&/>').renderToString())
                .to.equal('<span>&lt;&amp;/&gt;</span>');
        });

        it('should be rendered as a text node', () => {
            expect(createNode('text').children('text').renderToString())
                .to.equal('<!---->text<!---->');
        });
    });

    describe('html', () => {
        it('should be rendered without escaping', () => {
            expect(createNode('span').html('<span></span><i></i>').renderToString())
                .to.equal('<span><span></span><i></i></span>');
        });
    });

    describe('fragment', () => {
        it('should be rendered as fragment', () => {
            expect(createNode('div').children([
                createNode('a'),
                createNode('fragment').children([
                    createNode('i'),
                    createNode('fragment').children(createNode('u')),
                    createNode('span')
                ]),
                createNode('b')
            ]).renderToString())
                .to.equal('<div><a></a><!----><i></i><!----><u></u><!----><span></span><!----><b></b></div>');
        });

        it('should be rendered as comment if no children', () => {
            expect(createNode('div').children([
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
                    .attrs({ value : 2 })
                    .children([
                        createNode('option').attrs({ value : 1 }),
                        createNode('option').attrs({ value : 2 })
                    ])
                    .renderToString())
                .to.equal('<select><option value="1"></option><option selected value="2"></option></select>');
        });

        it('should be properly rendered with multiple values', () => {
            expect(
                createNode('select')
                    .attrs({ multiple : true, value : [2, 3] })
                    .children([
                        createNode('group').children([
                            createNode('option').attrs({ value : 1 }),
                            createNode('option').attrs({ value : 2 }),
                            createNode('option').attrs({ value : 3 })
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
                onRender : function(attrs, content) {
                    return createNode('div').attrs(attrs).children([
                        createNode('a'),
                        createNode('span')
                    ].concat(content));
                }
            });

            expect(createNode(Component).attrs({ id : 'id1' }).children(createNode('i')).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>')
        });

        it('should render comment if onRender() returns nothing', () => {
            const Component = createComponent({
                onRender : () => {}
            });

            expect(createNode(Component).renderToString())
                .to.equal('<!---->');
        });
    });

    describe('functional component', () => {
        it('should be rendered as component', () => {
            const Component = (attrs, content) => {
                return createNode('div').attrs(attrs).children([
                    createNode('a'),
                    createNode('span')
                ].concat(content));
            };

            expect(createNode(Component).attrs({ id : 'id1' }).children(createNode('i')).renderToString())
                .to.equal('<div id="id1"><a></a><span></span><i></i></div>')
        });

        it('should render comment if returns nothing', () => {
            const Component = () => {};

            expect(createNode(Component).renderToString())
                .to.equal('<!---->');
        });
    });
});
