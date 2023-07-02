import fs from 'fs';

type Gender = 'Male' | 'Female';

export interface IUser {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    status: boolean;
    creationTimestamp: Date;
    modificationTimestamp: Date;
}

export class UserService {
    get(id: string): IUser | undefined {
        const users: IUser[] = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
        const foundUser = users.find((user) => Number(user.id) === Number(id));
        return foundUser;
    }

    getAll(): IUser[] | string {
        const data = fs.readFileSync('db.json', 'utf-8');
        return data ? JSON.parse(data) : 'No User found';
    }

    create(
        payload: Omit<IUser, 'id' | 'creationTimestamp' | 'modificationTimestamp'>
    ): IUser {
        const { name, age, gender, status = false } = payload;
        const newUser: IUser = {
            id: Math.floor(1000 * Math.random()).toString(),
            name,
            age,
            gender,
            status,
            creationTimestamp: new Date(),
            modificationTimestamp: new Date(),
        };
        let users: IUser[] = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
        users = users ? users : [];
        users.push(newUser);
        fs.writeFileSync('db.json', JSON.stringify(users, null, 2));
        return newUser;
    }

    activate(id: string): IUser | undefined {
        let activated: IUser | undefined;
        let users: IUser[] = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
        if (!users) return;
        users = users.map((user) => {
            if (Number(user.id) === Number(id)) {
                activated = user;
                user.status = true;
                user.modificationTimestamp = new Date();
            }
            return user;
        });
        fs.writeFileSync('db.json', JSON.stringify(users, null, 2));
        return activated;
    }

    delete(id: string): IUser | undefined {
        const removedUser = this.get(id);
        let users: IUser[] = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
        if (!users) return;
        users = users.filter((user) => Number(user.id) !== Number(id));
        fs.writeFileSync('db.json', JSON.stringify(users, null, 2));
        return removedUser;
    }
}

