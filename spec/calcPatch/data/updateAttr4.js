module.exports = {
    "name" : "updateAttr4",
    "trees" : [
        {
            "tag" : "div",
            "attrs" : {
                "style" : {
                    "width" : "100px",
                    "height" : "100px",
                    "float" : "left",
                    "borderRadius" : "5px",
                    "opacity" : null
                }
            }
        },
        {
            "tag" : "div",
            "attrs" : {
                "style" : {
                    "width" : "100px",
                    "float" : "right",
                    "background" : "red",
                    "borderRadius" : null,
                    "color" : null
                }
            }
        }
    ],
    "patch" : [
        {
            "type" : 2,
            "path" : "",
            "attrName" : "style",
            "attrVal" : {
                "height" : null,
                "float" : "right",
                "background" : "red",
                "borderRadius" : null
            }
        }
    ]
};
