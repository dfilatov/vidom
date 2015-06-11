var vidom = require('../lib/vidom'),
    users = [
        { login : 'dmitry', online : false },
        { login : 'vitaly', online : false },
        { login : 'alexey', online : false },
        { login : 'vadim', online : false },
        { login : 'olga', online : false },
        { login : 'petr', online : false },
        { login : 'marta', online : false },
        { login : 'olesya', online : false },
        { login : 'yuri', online : false },
        { login : 'sergey', online : false },
        { login : 'inna', online : false }
    ],
    tree = buildTree(sortUsers()),
    rootDomNode = document.body.appendChild(vidom.renderToDom(tree));

function updateUsersStates() {
    users.forEach(function(user) {
        user.online = Math.random() > .5;
    });
}

function sortUsers() {
    return users
        .slice()
        .sort(function(user1, user2) {
            return user1.online === user2.online?
                user1.login.localeCompare(user2.login) :
                user2.online - user1.online;
        })
        .map(function(user) {
            return user.login;
        });
}

function buildTree(sortOrder) {
    var onlineUsers = users.filter(function(user) {
            return user.online;
        }),
        offlineUsers = users.filter(function(user) {
            return !user.online;
        });

    return {
        tag : 'div',
        attrs : { className : 'users' },
        children : users.map(function(user) {
            return {
                tag : 'div',
                key : user.login,
                attrs : {
                    className : 'user' + (user.online? ' user_online' : ''),
                    style : {
                        transform : 'translateY(' + (sortOrder.indexOf(user.login) * 30) + 'px)'
                    }
                },
                children : [{ text : user.login }]
            };
        }).concat({
            tag : 'div',
            key : '__delimiter__',
            attrs : {
                className : 'delimiter' + (onlineUsers.length && offlineUsers.length?
                    ' delimiter_visible' :
                    ''),
                style : {
                    transform : 'translateY(' + (onlineUsers.length * 30) + 'px)'
                }
            }
        })
    };
}

function update() {
    requestAnimationFrame(function() {
        updateUsersStates();
        vidom.patchDom(rootDomNode, vidom.calcPatch(tree, tree = buildTree(sortUsers())));
        setTimeout(update, 3000);
    });
}

update();