/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const saml = require('saml-encoder-decoder-js');
const parseString = require('xml2js').parseString;

module.exports = {
  login: function (req, res) {
    // res.redirect('/');
    // res.writeHead(301, { Location: 'http://euk-88794.eukservers.com' });
    // res.end();
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  samlConsumeToken: (req, res) => {
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
                  Location: 'https://megowork.co.uk/#/auth/' + createdObj.id
                });
                res.end();
              });
            } else {
              res.writeHead(301, {
                Location: 'https://megowork.co.uk/#/auth/' + user[0].id
              });
              res.end();
            }
          }).catch(err => {
            console.log(err);
          });
        });
      }
    });
  }
};
