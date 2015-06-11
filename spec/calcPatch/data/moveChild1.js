module.exports = {
    "name" : "moveChild1",
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
                    "key" : "b",
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
                    "key" : "b",
                    "attrs" : {
                        "value" : "text"
                    }
                },
                {
                    "tag" : "input",
                    "key" : "a",
                    "attrs" : {
                        "value" : "text"
                    }
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 8,
            "idxFrom" : 1,
            "idxTo" : 0
        }
    ]
};
