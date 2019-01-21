import * as path from 'path';

export const config = {
    port: 3003,
    mysqlCred: {
        host: 'pma.srv3.malcher-server.de',
        user: 'lagersystem',
        password: 'hZgF59CO9YmKJIlF4ST9tR',
        database: 'steckeroauth'
    },
    ldap: {
        server   : 'localhost',
        port     : 11389,
        basedn   : 'dc=club,dc=hft-leipzig,dc=de',
        userbase : 'ou=users',
        groupbase: 'ou=groups',
        admindn  : 'cn=cisauth,ou=system,dc=club,dc=hft-leipzig,dc=de',
        adminpw  : 'hJNJbK6Gvhjf3vRZjFV4h8jGdtKJ'
    },
    tokenLifetime: 3600,
    keys: {
        private: path.join(__dirname, 'keys', 'private.pem'),
        public: path.join(__dirname, 'keys', 'public.pem')
    }
}