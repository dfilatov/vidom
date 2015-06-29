module.exports = {
    "name" : "replace1",
    "trees" : [
        {
            "tag" : "div"
        },
        {
            "tag" : "span"
        }
    ],
    "patch" : [
        {
            "type" : 4,
            "node" : {
                "tag" : "span"
            }
        }
    ]
};
