module.exports = {
    "name" : "updateText1",
    "trees" : [
        {
            "tag" : "span",
            "children" : [
                {
                    "text" : "text"
                }
            ]
        },
        {
            "tag" : "span",
            "children" : [
                {
                    "text" : "new text"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 1,
            "path" : ".0",
            "text" : "new text"
        }
    ]
};
