module.exports = {
    "name" : "replace3",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "div",
                    "key" : "a"
                },
                {
                    "tag" : "div"
                }
            ]
        },
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "span",
                    "key" : "a"
                },
                {
                    "tag" : "div"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 10,
            "children" : [
                {
                    "idx" : 0,
                    "patch" : [
                        {
                            "type" : 4,
                            "newNode" : {
                                "tag" : "span",
                                "key" : "a"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
