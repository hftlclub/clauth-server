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
    secret: 'loremipsum' // secret the access token is signed with
}