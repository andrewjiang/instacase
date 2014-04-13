var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
    development: {
        db: 'mongodb://localhost/instacase_dev',
        root: rootPath,
        app: {
            name: 'Instacase'
        },
        facebook: {
            clientID: '305625832925093',
            clientSecret: 'de26ad36634371a34381a5f5918ad182',
            callbackURL: 'http://localhost:3000/auth/facebook/callback'
        }
    },
    production: {
        db: process.env.MONGO_URL,
        root: rootPath,
        app: {
            name: 'Instacase'
        },
        facebook: {
            clientID: '236858273165593',
            clientSecret: '1a1c8584fd3ed34796f39ba5f826d4d7',
            callbackURL: 'https://battletrophy.com/auth/facebook/callback'
        }
    },
    stage: {
    }
};
