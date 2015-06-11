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
            "childNode" : {
                "tag" : "div"
            }
        },
        {
            "type" : 5,
            "childNode" : {
                "tag" : "span"
            }
        }
    ]
};
