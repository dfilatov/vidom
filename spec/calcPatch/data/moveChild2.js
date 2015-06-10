module.exports = {
    "name" : "moveChild1",
    "trees" : [
        {
            "tag" : "div",
            "children" : [
                { "tag" : "a", "key" : "a" },
                { "tag" : "a", "key" : "b" },
                { "tag" : "a", "key" : "c" },
                { "tag" : "a", "key" : "d" }
            ]
        },
        {
            "tag" : "div",
            "children" : [
                { "tag" : "a", "key" : "d" },
                { "tag" : "a", "key" : "c" },
                { "tag" : "a", "key" : "b" },
                { "tag" : "a", "key" : "a" },
            ]
        }
    ],
    "patch" : [
        {
            "type" : 8,
            "path" : "",
            "idxFrom" : 3,
            "idxTo" : 0
        },
        {
            "type" : 8,
            "path" : "",
            "idxFrom" : 3,
            "idxTo" : 1
        },
        {
            "type" : 8,
            "path" : "",
            "idxFrom" : 3,
            "idxTo" : 2
        }
    ]
};
