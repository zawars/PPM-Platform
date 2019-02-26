/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const saml = require('saml-encoder-decoder-js');
const parseString = require('xml2js').parseString;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const speakEasy = require('speakeasy');

module.exports = {
  login: function (req, res) {
    // res.redirect('/');
    // res.writeHead(301, { Location: 'http://euk-88794.eukservers.com' });
    // res.end();
  },

  logout: function (req, res) {
    req.session.destroy(function (err) {
      RedisService.del(req.headers.authorization.split(' ').pop(), (response) => {
        setTimeout(function () {
          return res.ok();
        }, 2500); // redirect wait time 2.5 seconds
      });
    });
  },

  externalLogin: async (req, res) => {
    try {
      let userObj = await User.findOne({
        email: req.params.email
      });

      if (userObj) {
        let secret = speakEasy.totp({
          digits: 6,
          secret: sails.config.secret + userObj.email,
          encoding: 'base32',
          step: 300
        });

        EmailService.sendMail({
          email: userObj.email,
          subject: 'Verification',
          message: `You verification token is: '${secret}'. \n`
        })
        res.ok({
          user: userObj,
          message: 'Verification token sent to you email.'
        });
      } else {
        req.forbidden('User not found');
      }
    } catch (error) {
      res.badRequest(error)
    }
  },

  verifyTokenExternal: async (req, res) => {
    try {
      let tokenValidates = speakEasy.totp.verify({
        secret: sails.config.secret + req.body.email,
        encoding: 'base32',
        token: req.body.token,
        step: 300
      });

      let user = await User.findOne({
        email: req.body.email
      });

      jwt.sign({
        user
      }, sails.config.secret, (err, token) => {
        RedisService.set(token, userObj, () => {
          res.ok({
            userObj,
            token,
            validate: tokenValidates
          });
        });
      });


    } catch (error) {
      res.badRequest(error)
    }
  },

  samlConsumeToken: (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    //save user;
    saml.decodeSamlPost(req.body.SAMLResponse, function (err, xml) {
      if (!err) {
        parseString(xml, function (err, result) {
          let email = result['samlp:Response'].Assertion[0].AttributeStatement[0].Attribute.pop().AttributeValue[0];
          User.find({
            email: email
          }).then(user => {
            if (user.length == 0) {
              User.create({
                email: email,
                role: 'guest',
              }).then(createdObj => {
                res.writeHead(301, {
                  Location: config.callbackRedirectUrl + createdObj.id
                });
                res.end();
              });
            } else {
              res.writeHead(301, {
                Location: config.callbackRedirectUrl + user[0].id
              });
              res.end();
            }
          }).catch(err => {
            console.log(err);
          });
        });
      }
    });
  },

  getTokenOnLogin: async (req, res) => {
    let userObj = await User.findOne({
      id: req.params.id
    });

    if (userObj != undefined) {
      req.session.user = userObj;
      jwt.sign({
        user: userObj
      }, sails.config.secret, (err, token) => {
        RedisService.set(token, userObj, () => {
          res.ok({
            userObj,
            token
          });
        });
      });
    } else {
      res.forbidden('You are not permitted to perform this action. Unauthorized, user not found.');
    }
  }
};
