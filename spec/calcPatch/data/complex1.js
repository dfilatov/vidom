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
            "type" : 8,
            "idxFrom" : 2,
            "idxTo" : 1
        },
        {
            "type" : 7,
            "idx" : 3,
            "node" : {
                "tag" : "div",
                "attrs" : {
                    "id" : "id2"
                }
            }
        },
        {
            "type" : 6,
            "idx" : 4
        },
        {
            "type" : 6,
            "idx" : 4
        },
        {
            "type" : 10,
            "children" : [
                {
                    "idx" : 0,
                    "patch" : [
                        {
                            "type" : 2,
                            "attrName" : "value",
                            "attrVal" : "text2"
                        },
                        {
                            "type" : 3,
                            "attrName" : "disabled"
                        }
                    ]
                },
                {
                    "idx" : 1,
                    "patch" : [
                        {
                            "type" : 10,
                            "children" : [
                                {
                                    "idx" : 0,
                                    "patch" : [
                                        {
                                            "type" : 10,
                                            "children" : [
                                                {
                                                    "idx" : 0,
                                                    "patch" : [
                                                        {
                                                            "type" : 1,
                                                            "text" : "bad"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "type" : 2,
                                            "attrName" : "id",
                                            "attrVal" : "id1"
                                        }
                                    ]
                                },
                                {
                                    "idx" : 1,
                                    "patch" : [
                                        {
                                            "type" : 8,
                                            "idxFrom" : 1,
                                            "idxTo" : 0
                                        },
                                        {
                                            "type" : 6,
                                            "idx" : 1
                                        },
                                        {
                                            "type" : 10,
                                            "children" : [
                                                {
                                                    "idx" : 0,
                                                    "patch" : [
                                                        {
                                                            "type" : 4,
                                                            "node" : {
                                                                "tag" : "span",
                                                                "key" : "a",
                                                                "children" : [
                                                                    {
                                                                        "text" : "new text"
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
