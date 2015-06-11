module.exports = {
    "name" : "removeAttr1",
    "trees" : [
        {
            "tag" : "input",
            "attrs" : {
                "value" : "text",
                "className" : "input"
            }
        },
        {
            "tag" : "input",
            "attrs" : {
                "value" : "text"
            }
        }
    ],
    "patch" : [
        {
            "type" : 3,
            "attrName" : "className"
        }
    ]
};
