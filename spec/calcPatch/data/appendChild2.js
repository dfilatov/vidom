module.exports = {
    "name" : "appendChild2",
    "trees" : [
        {
            "tag" : "div"
        },
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "div"
                },
                {
                    "tag" : "span"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 5,
            "node" : {
                "tag" : "div"
            }
        },
        {
            "type" : 5,
            "node" : {
                "tag" : "span"
            }
        }
    ]
};
