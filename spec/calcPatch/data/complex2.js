module.exports = {
    "name" : "complex1",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "a",
                    "key" : "c",
                    "text" : "text"
                },
                {
                    "tag" : "a",
                    "key" : "a"
                },
                {
                    "tag" : "a",
                    "key" : "d"
                }
            ]
        },
        {
            "tag" : "div",
            "children" : [
                {
                    "tag" : "a",
                    "key" : "b",
                    "text" : "new text"
                },
                {
                    "tag" : "a",
                    "key" : "a"
                }
            ]
        }
    ],
    "patch" : [
        {
            "type" : 1,
            "path" : ".0",
            "text" : "new text"
        },
        {
            "type" : 6,
            "path" : "",
            "idx" : 2
        }
    ]
};
