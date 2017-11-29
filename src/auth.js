import passport from 'passport';
let LocalStrategy = require('passport-local').Strategy;
// import { Parent } from './data/connector';
import { sequelizeInitial } from './data/connector';
const crypto = require('crypto');

passport.use('local', new LocalStrategy(
    async(username, password, done) => {
        var shareDB = sequelizeInitial('ecm_share');
        var parentGlobal = await shareDB.ParentGlobal.find({
                attributes: ['id', 'email', 'phone'],
                where: {
                    email: username,
                    password: crypto.createHash('md5').update(password).digest('hex')
                }
            })
            // var schoolDB = sequelizeInitial(parentGlobal.get().database_school)
            // let checkPassword = await schoolDB.Parent.find({
            //     attributes: ['parent_id', 'gender', 'parent_name', 'phone_m', 'email'],
            //     where: {
            //         email: {
            //             $eq: username
            //         },
            //         password: {
            //             $eq: crypto.createHash('md5').update(password).digest('hex')
            //         }
            //     }
            // })
        if (parentGlobal != null) {
            var parentDetail = await shareDB.ParentDetail.findAll({
                where: {
                    parent_id: parentGlobal.get().id
                }
            })
            var databases = parentDetail.map((item) => item.get().database_name)
            var companiesLogo = []
            for (let i = 0; i < databases.length; i++) {
                var DB = sequelizeInitial(databases[i]);
                console.log(databases[i])
                var account = await DB.Parent.find({
                    attributes: ['account'],
                    where: {
                        email: parentGlobal.get().email
                    }
                })
                console.log(account)
                if (account != null) {
                    var companyLogo = await DB.Account.find({
                        attributes: ['name', 'company_logo'],
                        where: {
                            account_id: account.get().account
                        }
                    })
                    companiesLogo.push({
                        companyName: companyLogo.get().name,
                        logo: companyLogo.get().company_logo
                    })
                }
            }
            var result = Object.assign({}, parentGlobal.get(), { databases, companiesLogo })
            return done(null, result)
        } else {
            return done(null, null, { message: 'Invalid username or password.' })
        }
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(async(id, done) => {
    var shareDB = sequelizeInitial('ecm_share');
    var parentGlobal = await shareDB.ParentGlobal.find({
        attributes: ['id', 'email', 'phone'],
        where: {
            email: username,
            password: crypto.createHash('md5').update(password).digest('hex')
        }
    })
    var parentDetail = await shareDB.ParentDetail.findAll({
        where: {
            parent_id: parentGlobal.get().id
        }
    })
    var databases = parentDetail.map((item) => item.get().database_name)
    var companiesLogo = []
    for (let i = 0; i < databases.length; i++) {
        var DB = sequelizeInitial(databases[i]);
        var account = await DB.Parent.find({
            attributes: ['account_id'],
            where: {
                email: parentGlobal.get().email
            }
        })
        if (account.length > 0) {
            var companyLogo = await DB.Account.find({
                attributes: ['name', 'company_logo'],
                where: {
                    account_id: account.get().account_id
                }
            })
            companiesLogo.push({
                companyName: companyLogo.get().name,
                logo: companyLogo.get().company_logo
            })
        }
    }
    var result = Object.assign({}, parentGlobal.get(), { databases, companiesLogo })
    return done(err, result)
        // return done(err, parentGlobal.get());
        // Parent.find({
        //         attributes: ['parent_id', 'gender', 'parent_name', 'phone_m', 'email'],
        //         where: {
        //             parent_id: {
        //                 $eq: id
        //             }
        //         }
        //     })
        //     .then((parent, err) => {

    //     })
});