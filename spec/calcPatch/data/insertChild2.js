module.exports = {
    "name" : "insertChild2",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "span"
                },
                {
                    "tag" : "input"
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
                    "tag" : "input",
                    "key" : "a",
                    "attrs" : {
                        "value" : "text"
                    }
                },
                {
                    "tag" : "input"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 7,
            "path" : "",
            "idx" : 1,
            "childNode" : {
                "tag" : "input",
                "key" : "a",
                "attrs" : {
                    "value" : "text"
                }
            }
        }
    ]
};
