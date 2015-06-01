module.exports = {
    "name" : "removeAttr3",
    "trees" : [
        {
            "tag" : "input",
            "attrs" : {
                "className" : "input"
            }
        },
        {
            "tag" : "input",
            "attrs" : {
                "className" : null
            }
        }
    ],
    "patch" : [
        {
            "type" : 3,
            "path" : "",
            "attrName" : "className"
        }
    ]
};
