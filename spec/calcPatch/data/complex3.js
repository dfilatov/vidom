module.exports = {
    "name" : "complex2",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "a",
                    "key" : "a"
                },
                {
                    "tag" : "a",
                    "key" : "c"
                },
                {
                    "tag" : "a",
                    "key" : "e"
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
                },
                {
                    "tag" : "a",
                    "key" : "f"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 7,
            "idx" : 1,
            "childNode" : {
                "tag" : "a",
                "key" : "b"
            }
        },
        {
            "type" : 7,
            "idx" : 3,
            "childNode" : {
                "tag" : "a",
                "key" : "d"
            }
        },
        {
            "type" : 5,
            "childNode" : {
                "tag" : "a",
                "key" : "f"
            }
        }
    ]
};
