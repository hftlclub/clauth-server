import * as ldapjs from 'ldapjs';
import * as ssha from 'ssha';

import { config } from '../../config';
import { client as ldapClient }  from '../modules/ldap';

const userattrs = {
    // LDAPAttr : ClubAdminAttr
    'uid': 'username',
    'uidNumber': 'uidNumber',
    'sn': 'lastname',
    'givenName': 'firstname',
    'street': 'street',
    'postalCode': 'zip',
    'l': 'city',
    'mail': 'email',
    'telephoneNumber': 'tel',
    'loginShell': 'loginShell',
    'employeeType': 'role',
    'title': 'alias',
    'dialupAccess': 'birthday',
    'physicalDeliveryOfficeName': 'accessiondate'
}

//inverted set of "userattrs"
const ldapattrs = [];

//simple list of all ldap attributes for a user
const userldapattrs = [];

//fill "userldapattrs" and "ldapattrs"
for (const k in userattrs) {
    userldapattrs.push(k);
    ldapattrs[userattrs[k]] = k;
}


/****************************************/


export class UserService {

    // check password for user (uid)
    static async checkpassword(uid, password) {
        return new Promise((resolve, reject) => {
            if (!password) {
                return reject(new Error('no password given'));
            }

            const opts = {
                attributes: ['userPassword']
            };

            ldapClient.search(UserService.uidtodn(uid), opts, (err, res) => {
                if (err) {
                    return reject(false);
                }

                res.on('searchEntry', entry => {
                    // verify password
                    if (ssha.verify(password, entry.object.userPassword)) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                });

                res.on('error', err => reject(err));
            });
        });
    }





    // get one user by uid
    static async getUserByUid(uid): Promise<any> {
        return new Promise((resolve, reject) => {
        
            const opts = {
                attributes: userldapattrs
            };

            ldapClient.search(UserService.uidtodn(uid), opts, (err, res) => {
                if (err) { return reject(err); }

                res.on('searchEntry', async (entry: any) => {
                    const user: any = {};
                    for (const key in userattrs) {
                        user[userattrs[key]] = entry.object[key];
                    }

                    // get groups for user
                    const groups = await this.getGroupsByUid(uid);

                    // set flags according to groups user belongs to
                    const groupsadd = [{
                        group: 'clubadmins',
                        key: 'superuser'
                    }, {
                        group: 'clubformer',
                        key: 'former'
                    }, {
                        group: 'clubhonorary',
                        key: 'honorary'
                    }, {
                        group: 'clubapplicants',
                        key: 'applicant'
                    }, {
                        group: 'clubexec',
                        key: 'executive'
                    }, {
                        group: 'clubonleave',
                        key: 'onleave'
                    } ];

                    groupsadd.forEach(row => user[row.key] = (groups.indexOf(row.group) >= 0) ? true : false);

                    /**********/

                    // sort into usertype groups
                    if (groups.indexOf('clubmembers') >= 0) {
                        user.type = 'club';
                    } else if (groups.indexOf('clubothers') >= 0) {
                        user.type = 'other';
                    } else {
                        user.type = null;
                    }

                    return resolve(user);
                });

                res.on('error', err => reject(err));

            });
        });
    }



    static async getGroupsByUid(uid): Promise<any> {
        return new Promise((resolve, reject) => {
            const opts = {
                attributes: ['cn'],
                scope: 'one',
                filter: '(memberUid=' + uid + ')'
            };
        
            // get groups
            ldapClient.search(config.ldap.groupbase + ',' + config.ldap.basedn, opts, function(err, res) {
                if (err) { return reject(err); }
        
                const groups = [];
                res.on('searchEntry', entry => groups.push(entry.object.cn));
        
                res.on('end', result => resolve(groups));
                res.on('error', err => reject(err));
            });
        });
    }


    static uidtodn(uid) {
        return 'uid=' + uid + ',' + config.ldap.userbase + ',' + config.ldap.basedn;
    }

}