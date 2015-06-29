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
            "idx" : 1,
            "node" : {
                "tag" : "input",
                "key" : "a",
                "attrs" : {
                    "value" : "text"
                }
            }
        }
    ]
};
