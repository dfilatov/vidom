module.exports = {
    "name" : "complex2",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "a",
                    "key" : "c",
                    "text" : "text"
                },
                {
                    "tag" : "a",
                    "key" : "a"
                },
                {
                    "tag" : "a",
                    "key" : "d"
                }
            ]
        },
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "a",
                    "key" : "b",
                    "text" : "new text"
                },
                {
                    "tag" : "a",
                    "key" : "a"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 6,
            "idx" : 2
        },
        {
            "type" : 10,
            "children" : [
                {
                    "idx" : 0,
                    "patch" : [
                        {
                            "type" : 1,
                            "text" : "new text"
                        }
                    ]
                }
            ]
        }
    ]
};
