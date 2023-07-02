import fs from 'fs'

export class UserService {
    get(id) {
        const users = JSON.parse(fs.readFileSync('db.json'));
        const foundUser = users.find((user) => Number(user.id) === Number(id));
        return foundUser;
    }

    getAll() {
        return JSON.parse(fs.readFileSync('db.json'));
    }

    create(payload) {
        const { name, age, gender, status = false } = payload;
        const newUser = { id: Math.floor(1000 * Math.random()).toString(), name, age, gender, status };
        let users = fs.readFileSync('db.json');
        users = users.toString() ? JSON.parse(users) : [];
        users.push(newUser);
        fs.writeFileSync('db.json', JSON.stringify(users, null, 2));
        return newUser;
    }

    activate(id) {
        let activated = {};
        let users = fs.readFileSync('db.json');
        users = JSON.parse(users).map((user) => {
            if (Number(user.id) === Number(id)) {
                activated = user;
                user.status = true;
            }
            return user;
        })
        fs.writeFileSync('db.json', JSON.stringify(users, null, 2));
        return activated;
    }

    delete(id) {
        const removedUser = this.get(id);
        let users = fs.readFileSync('db.json');
        users = JSON.parse(users).filter((user) => (Number(user.id) !== Number(id)));
        fs.writeFileSync('db.json', JSON.stringify(users, null, 2));
        return removedUser;
    }

}
