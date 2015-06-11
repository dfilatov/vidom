module.exports = {
    "name" : "updateAttr2",
    "trees" : [
        {
            "tag" : "input",
            "attrs" : {
                "value" : "text"
            }
        },
        {
            "tag" : "input",
            "attrs" : {
                "value" : "text",
                "disabled" : true
            }
        }
    ],
    "patch" : [
        {
            "type" : 2,
            "attrName" : "disabled",
            "attrVal" : true
        }
    ]
};
