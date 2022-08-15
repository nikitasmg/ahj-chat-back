class User {

    constructor() {
        this.users = []
    }

    loginUser() {
        if (this.users.some((el) => el === name)) {
            res.status(400).json({message:`Никнейм ${name} уже занят `})
        } else {
            this.users.push(name)
            res.status(200).json({user: name})
        }
    }
}