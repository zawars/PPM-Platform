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

    const bearerToken = req.headers['authorization'].split(' ')[1];
    RedisService.get(bearerToken, async (result) => {
      if (result) {
        console.log(`${result.email} is logging out. Deleting session...`);
        req.user = {};
        req.user.saml = {};
        req.user.saml.nameID = result.email;
        req.user.saml.nameIDFormat = result.format == undefined ? '' : result.format;
        req.user.id = req.user.saml.nameID;
        req.user.nameID = req.user.saml.nameID;
        req.user.nameIDFormat = req.user.saml.nameIDFormat;

        req.session.destroy(function (err) {
          RedisService.del(bearerToken, (response) => {
            EmailService.samlStrategy.logout(req, function (err, uri) {
              if (!err) {
                //redirect to the IdP Logout URL
                res.ok({
                  uri
                });
              } else {
                ErrorsLogService.logError('Auth', err.toString(), 'logout', req);
              }
            });
          });
        });
      }
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
        }, () => {
          res.ok({
            user: userObj,
            message: 'Verification token sent to you email.'
          });
        })
      } else {
        req.forbidden('User not found');
      }
    } catch (error) {
      ErrorsLogService.logError('Auth', error.toString(), 'externalLogin', req);
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

      if (tokenValidates) {
        jwt.sign({
          user
        }, sails.config.secret, (err, token) => {
          RedisService.set(token, user, () => {
            res.ok({
              user,
              token,
              validate: tokenValidates
            });
          });
        });
      } else {
        res.ok({
          validate: tokenValidates
        });
      }
    } catch (error) {
      ErrorsLogService.logError('Auth', error.toString(), 'verifyTokenExternal', req);
      res.badRequest(error)
    }
  },

  samlConsumeToken: (req, res) => {
    let params = '';
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    if (req.body.RelayState != '' && req.body.RelayState != undefined) {
      params = `;redirectTo=${req.body.RelayState}`;
    }

    //save user;
    saml.decodeSamlPost(req.body.SAMLResponse, function (err, xml) {
      if (!err) {
        parseString(xml, function (err, result) {
          let email = result['samlp:Response'].Assertion[0].AttributeStatement[0].Attribute.pop().AttributeValue[0];
          User.find({
            email: email
          }).then(async user => {
            if (user.length == 0) {
              User.create({
                email: email,
                format: result['samlp:Response'].Assertion[0].Subject[0].NameID[0]['$'].Format,
                role: 'guest',
              }).then(createdObj => {
                res.writeHead(301, {
                  Location: config.callbackRedirectUrl + createdObj.id + params
                });
                res.end();
              }).catch(error => {
                ErrorsLogService.logError('Auth', error.toString(), 'samlConsumeToken', req);
              })
            } else {
              await User.update({
                email: email
              }).set({
                format: result['samlp:Response'].Assertion[0].Subject[0].NameID[0]['$'].Format
              });
              res.writeHead(301, {
                Location: config.callbackRedirectUrl + user[0].id + params
              });
              res.end();
            }
          }).catch(err => {
            ErrorsLogService.logError('Auth', err.toString(), 'samlConsumeToken', req);
          });
        });
      }
    });
  },

  samlLogout: async (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    res.writeHead(301, {
      Location: config.callbackRedirectUrl
    });
    res.end();
  },

  getTokenOnLogin: async (req, res) => {
    let userObj = await User.findOne({
      id: req.params.id
    });

    if (userObj != undefined) {
      delete(userObj.tablesState);

      req.session.user = userObj;
      jwt.sign({
        user: userObj
      }, sails.config.secret, (err, token) => {
        RedisService.set(token, userObj, () => {
          console.log(`${userObj.email} logged in.`);
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
