import { mount } from 'vidom';

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
];

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

    return (
        <div class="users">
            {
                users.map(user =>
                    <div
                        key={ user.login }
                        class={ 'user' + (user.online? ' user_online' : '') }
                        style={{ transform : 'translateY(' + (sortOrder.indexOf(user.login) * 30) + 'px)' }}
                    >
                        { user.login }
                    </div>)
            }
            <div
                key="__delimiter__"
                class={ 'delimiter' + (onlineUsers.length && offlineUsers.length? ' delimiter_visible' : '') }
                style={{ transform : 'translateY(' + (onlineUsers.length * 30) + 'px)' }}
            />
        </div>
    );
}

function update() {
    mount(document.body, buildTree(sortUsers()), function() {
        updateUsersStates();
        setTimeout(update, 3000);
    });
}

update();
