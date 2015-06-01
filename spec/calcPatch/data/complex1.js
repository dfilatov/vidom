module.exports = {
    "name" : "complex1",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "input",
                    "key" : "a",
                    "attrs" : {
                        "value" : "text",
                        "disabled" : true
                    }
                },
                {
                    "tag" : "label",
                    "attrs" : {
                        "for" : "test"
                    }
                },
                {
                    "tag" : "div",
                    "key" : "b",
                    "children" : [
                        {
                            "tag" : "span",
                            "children" : [
                                {
                                    "text" : "good"
                                }
                            ]
                        },
                        {
                            "tag" : "div",
                            "children" : [
                                {
                                    "tag" : "span"
                                },
                                {
                                    "tag" : "a",
                                    "key" : "a",
                                    "attrs" : {
                                        "href" : "http://ya.ru"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "tag" : "div",
                    "key" : "c"
                },
                {
                    "tag" : "div"
                }
            ]
        },
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "input",
                    "key" : "a",
                    "attrs" : {
                        "value" : "text2"
                    }
                },
                {
                    "tag" : "div",
                    "key" : "b",
                    "children" : [
                        {
                            "tag" : "span",
                            "attrs" : {
                                "id" : "id1"
                            },
                            "children" : [
                                {
                                    "text" : "bad"
                                }
                            ]
                        },
                        {
                            "tag" : "div",
                            "children" : [
                                {
                                    "tag" : "span",
                                    "key" : "a",
                                    "children" : [
                                        {
                                            "text" : "new text"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tag" : "label",
                    "attrs" : {
                        "for" : "test"
                    }
                },
                {
                    "tag" : "div",
                    "attrs" : {
                        "id" : "id2"
                    }
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 2,
            "path" : ".0",
            "attrName" : "value",
            "attrVal" : "text2"
        },
        {
            "type" : 3,
            "path" : ".0",
            "attrName" : "disabled"
        },
        {
            "type" : 8,
            "path" : "",
            "idxFrom" : 2,
            "idxTo" : 1
        },
        {
            "type" : 1,
            "path" : ".1.0.0",
            "text" : "bad"
        },
        {
            "type" : 2,
            "path" : ".1.0",
            "attrName" : "id",
            "attrVal" : "id1"
        },
        {
            "type" : 8,
            "path" : ".1.1",
            "idxFrom" : 1,
            "idxTo" : 0
        },
        {
            "type" : 4,
            "path" : ".1.1.0",
            "newNode" : {
                "tag" : "span",
                "key" : "a",
                "children" : [
                    {
                        "text" : "new text"
                    }
                ]
            }
        },
        {
            "type" : 6,
            "path" : ".1.1",
            "idx" : 1
        },
        {
            "type" : 7,
            "path" : "",
            "idx" : 3,
            "childNode" : {
                "tag" : "div",
                "attrs" : {
                    "id" : "id2"
                }
            }
        },
        {
            "type" : 6,
            "path" : "",
            "idx" : 4
        },
        {
            "type" : 6,
            "path" : "",
            "idx" : 4
        }
    ]
};
