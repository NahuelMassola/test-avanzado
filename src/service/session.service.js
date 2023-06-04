
class SessionService{
    constructor(dao){
        this.dao = dao
}
    getSession = (email, password) => this.dao.getSession({email, password});
    getUserId = (id) => this.dao.getId(id);
    getEmail = (email) => this.dao.getEmail(email);
    createUser = (user) => this.dao.create(user)
    updateUserPassword = (id, newPassword)=>this.dao.updatePassword(id, newPassword)
    updateUserRole = (id, newRole)=>this.dao.updateRole(id, newRole)

}
module.exports = SessionService