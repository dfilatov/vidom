module.exports = {
    "name" : "insertChild1",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "input",
                    "key" : "a",
                    "attrs" : {
                        "value" : "text"
                    }
                },
                {
                    "tag" : "input",
                    "key" : "c",
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
                    "key" : "a",
                    "attrs" : {
                        "value" : "text"
                    }
                },
                {
                    "tag" : "input",
                    "key" : "b",
                    "attrs" : {
                        "value" : "text"
                    }
                },
                {
                    "tag" : "input",
                    "key" : "c",
                    "attrs" : {
                        "value" : "text"
                    }
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
                "key" : "b",
                "attrs" : {
                    "value" : "text"
                }
            }
        }
    ]
};
