/**
 * HelpGuideMapperController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs');

module.exports = {
  show: (req, res) => {
    let id = req.params.id;

    HelpGuideMapper.findOne({
      id: id
    }).then(helpGuideObj => {
      if (helpGuideObj != undefined) {
        if (helpGuideObj.type == "text") {
          let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
          let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));
          let de = deFile[helpGuideObj.value];
          let fr = frFile[helpGuideObj.value];

          res.ok({
            data: helpGuideObj,
            de: de || '',
            fr: fr || ''
          });
        } else {
          res.ok({
            data: helpGuideObj,
          });
        }
      } else {
        res.badRequest({
          message: 'Data not Found'
        });
      }
    });
  },

  update: async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let obj = data.helpGuide;
    let de, fr, deFile, frFile;
    deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
    frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));

    if (obj.type == 'text') {
      de = data.de;
      fr = data.fr;
    }

    HelpGuideMapper.findOne({
      id: id
    }).then(async helpGuideObj => {
      if (helpGuideObj.type == 'text') {
        delete(deFile[helpGuideObj.value]);
        delete(frFile[helpGuideObj.value]);
      }

      if (obj.type == 'text') {
        deFile[obj.value] = de;
        frFile[obj.value] = fr;
        fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2));
        fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2));
      }

      HelpGuideMapper.update({
        id: id
      }).set(obj).then(response => {
        if (obj.type == 'text') {
          res.ok({
            data: response,
            de: deFile,
            fr: frFile
          });
        } else {
          res.ok({
            data: response,
          });
        }
      });
    });
  }

};
