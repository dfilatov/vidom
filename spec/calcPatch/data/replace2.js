module.exports = {
    "name" : "replace2",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "div"
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
                    "tag" : "span"
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
                            "node" : {
                                "tag" : "span"
                            }
                        }
                    ]
                }
            ]
        }
    ]
};
