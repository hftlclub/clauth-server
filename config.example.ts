import * as path from 'path';

export const config = {
    port: 3000,
    mysqlCred: {
        host: '',
        user: '',
        password: '',
        database: ''
    },
    ldap: {
        server   : 'localhost',
        port     : 389,
        basedn   : '',
        userbase : 'ou=users',
        groupbase: 'ou=groups',
        admindn  : '',
        adminpw  : ''
    },
    tokenLifetime: 3600,
    leys: {
        private: path.join(__dirname, 'keys', 'private.pem'),
        public: path.join(__dirname, 'keys', 'public.pem')
    }
}