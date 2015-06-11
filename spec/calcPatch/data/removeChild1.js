module.exports = {
    "name" : "removeChild1",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "div"
                },
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
                    "tag" : "div"
                },
                {
                    "tag" : "div"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 6,
            "idx" : 2
        }
    ]
};
