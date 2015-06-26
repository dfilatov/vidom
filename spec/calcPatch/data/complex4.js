module.exports = {
    "name" : "complex4",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "a",
                    "key" : "d"
                },
                {
                    "tag" : "a",
                    "key" : "b"
                }
            ]
        },
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "a",
                    "key" : "a"
                },
                {
                    "tag" : "a",
                    "key" : "b"
                },
                {
                    "tag" : "a",
                    "key" : "c"
                },
                {
                    "tag" : "a",
                    "key" : "d"
                },
                {
                    "tag" : "a",
                    "key" : "e"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 7,
            "idx" : 0,
            "childNode" : {
                "tag" : "a",
                "key" : "a"
            }
        },
        {
            "type" : 8,
            "idxFrom" : 2,
            "idxTo" : 1
        },
        {
            "type" : 7,
            "idx" : 2,
            "childNode" : {
                "tag" : "a",
                "key" : "c"
            }
        },
        {
            "type" : 5,
            "childNode" : {
                "tag" : "a",
                "key" : "e"
            }
        }
    ]
};
