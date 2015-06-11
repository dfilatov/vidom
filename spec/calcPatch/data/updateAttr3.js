module.exports = {
    "name" : "updateAttr3",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "input",
                    "attrs" : {
                        "value" : "text"
                    }
                },
                {
                    "tag" : "input",
                    "attrs" : {
                        "value" : "text"
                    }
                }
            ]
        },
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "input",
                    "attrs" : {
                        "value" : "text"
                    }
                },
                {
                    "tag" : "input",
                    "attrs" : {
                        "value" : "new text"
                    }
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 10,
            "children" : [
                {
                    "idx" : 1,
                    "patch" : [
                        {
                            "type" : 2,
                            "attrName" : "value",
                            "attrVal" : "new text"
                        }
                    ]
                }
            ]
        }
    ]
};
