import { node, mountToDom } from '../lib/vidom';

const users = [
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
    rootDomNode = document.body.appendChild(document.createElement('div'));

function updateUsersStates() {
    users.forEach(user => {
        user.online = Math.random() > .5;
    });
}

function sortUsers() {
    return users
        .slice()
        .sort((user1, user2) => {
            return user1.online === user2.online?
                user1.login.localeCompare(user2.login) :
                user2.online - user1.online;
        })
        .map(user => user.login);
}

function buildTree(sortOrder) {
    const onlineUsers = users.filter(user => user.online),
        offlineUsers = users.filter(user => !user.online);

    return node('div')
        .attrs({ className : 'users' })
        .children(users.map(user => {
            return node('div')
                .key(user.login)
                .attrs({
                    className : 'user' + (user.online? ' user_online' : ''),
                    style : {
                        transform : 'translateY(' + (sortOrder.indexOf(user.login) * 30) + 'px)'
                    }
                })
                .children(user.login);
        }).concat(
            node('div')
                .key('__delimiter__')
                .attrs({
                    className : 'delimiter' + (onlineUsers.length && offlineUsers.length?
                        ' delimiter_visible' :
                        ''),
                    style : {
                        transform : 'translateY(' + (onlineUsers.length * 30) + 'px)'
                    }
                })));
}

function update() {
    mountToDom(rootDomNode, buildTree(sortUsers()), function() {
        updateUsersStates();
        setTimeout(update, 3000);
    });
}

update();
