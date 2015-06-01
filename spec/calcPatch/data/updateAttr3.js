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
            "type" : 2,
            "path" : ".1",
            "attrName" : "value",
            "attrVal" : "new text"
        }
    ]
};
