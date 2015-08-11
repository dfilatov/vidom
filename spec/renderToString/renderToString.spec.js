var createNode = require('../../lib/createNode'),
    createComponent = require('../../lib/createComponent');

describe('renderToString', function() {
    describe('tag', function() {
        it('should be rendered properly', function() {
            expect(createNode('span').renderToString())
                .to.equal('<span></span>');
        });

        it('should be rendered as short tag', function() {
            expect(createNode('img').renderToString())
                .to.equal('<img/>');
        });
    });

    describe('ns', function() {
        it('should be rendered with given namespace', function() {
            expect(createNode('svg').ns('http://www.w3.org/2000/svg').renderToString())
                .to.equal('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        });
    });

    describe('children', function() {
        it('should be rendered as child nodes', function() {
            expect(createNode('div').children([createNode('span'), createNode('img')]).renderToString())
                .to.equal('<div><span></span><img/></div>');
        });
    });

    describe('attrs', function() {
        it('should be rendered properly', function() {
            expect(createNode('input').attrs({ type : 'text', id : 'id1', value : 'v1' }).renderToString())
                .to.equal('<input type="text" id="id1" value="v1"/>');
        });

        it('should be rendered properly for boolean attribues', function() {
            expect(createNode('input').attrs({ checked : true, disabled : true }).renderToString())
                .to.equal('<input checked disabled/>')
        });

        it('shouldn\'t render null value', function() {
            expect(createNode('input').attrs({ value : null }).renderToString())
                .to.equal('<input/>')
        });

        it('shouldn\'t render undefined value', function() {
            expect(createNode('input').attrs({ className : undefined }).renderToString())
                .to.equal('<input/>')
        });

        it('should not be rendered if boolean attribute is false', function() {
            expect(createNode('input').attrs({ checked : false }).renderToString())
                .to.equal('<input/>')
        });

        it('should properly render style', function() {
            expect(createNode('div').attrs({ style : { width : '100px', 'border-color' : 'red' } }).renderToString())
                .to.equal('<div style="width:100px;border-color:red;"></div>');
        });

        it('should properly render camelized style', function() {
            expect(createNode('div').attrs({ style : { borderLeftWidth : '5px' } }).renderToString())
                .to.equal('<div style="border-left-width:5px;"></div>');
        });

        it('should be rendered as data-attribute', function() {
            expect(createNode('div').attrs({ 'data-id' : '123' }).renderToString())
                .to.equal('<div data-id="123"></div>');
        });

        it('should be rendered as custom attribute', function() {
            expect(createNode('div').attrs({ 'custom-attr' : '123' }).renderToString())
                .to.equal('<div custom-attr="123"></div>');
        });

        it('should support alternative names', function() {
            expect(createNode('div').attrs({ className : 'c1', tabIndex : 4 }).renderToString())
                .to.equal('<div class="c1" tabindex="4"></div>');
        });

        it('should properly render textarea value', function() {
            expect(createNode('textarea').attrs({ value : 'val' }).renderToString())
                .to.equal('<textarea>val</textarea>');
        });
    });

    describe('text', function() {
        it('should be rendered as wrapped text node', function() {
            expect(createNode('span').children('some text').renderToString())
                .to.equal('<span>some text</span>');
        });

        it('should escape html', function() {
            expect(createNode('span').children('<&/>').renderToString())
                .to.equal('<span>&lt;&amp;/&gt;</span>');
        });
    });

    describe('html', function() {
        it('shouldn\'t escape html', function() {
            expect(createNode('span').html('<span></span><i></i>').renderToString())
                .to.equal('<span><span></span><i></i></span>');
        });
    });

    describe('select', function() {
        it('should be properly rendered', function() {
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

        it('should be properly rendered with multiple values', function() {
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

    describe('component', function() {
        it('should be rendered as component', function() {
            var Component = createComponent({
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

        it('should render <noscript/> if onRender() returns nothing', function() {
            var Component = createComponent({
                    onRender : function() {}
                });

            expect(createNode(Component).renderToString())
                .to.equal('<noscript></noscript>');
        });
    });
});
