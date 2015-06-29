module.exports = {
    "name" : "complex3",
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
            "node" : {
                "tag" : "a",
                "key" : "b"
            }
        },
        {
            "type" : 7,
            "idx" : 3,
            "node" : {
                "tag" : "a",
                "key" : "d"
            }
        },
        {
            "type" : 5,
            "node" : {
                "tag" : "a",
                "key" : "f"
            }
        }
    ]
};
