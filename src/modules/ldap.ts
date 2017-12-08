import * as ldapjs from 'ldapjs';

import { config } from '../../config';


export const client = ldapjs.createClient({
    url: 'ldap://' + config.ldap.server + ':' + config.ldap.port
});

client.bind(config.ldap.admindn, config.ldap.adminpw, (err) => {});



