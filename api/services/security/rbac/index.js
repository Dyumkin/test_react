import RBAC from 'rbac';
import { Roles } from '../roles';

const rbac = {
    roles: [Roles.ADMIN, Roles.USER, Roles.GUEST],
    permissions: {
        user: ['create', 'update', 'delete'],
        password: ['change', 'forgot']
    },
    grants: {
        guest: ['create_user', 'forgot_password'],
        user: ['change_password', 'update_user'],
        admin: ['user', 'delete_user']
    }
};

export default new RBAC(rbac, (err, rbacInstance) => {
    if (err) {
        throw err;
    }
});