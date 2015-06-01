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
            "path" : "",
            "childNode" : {
                "tag" : "div"
            }
        },
        {
            "type" : 5,
            "path" : "",
            "childNode" : {
                "tag" : "span"
            }
        }
    ]
};
