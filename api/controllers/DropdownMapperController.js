/**
 * DropdownMapperController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs');

module.exports = {
  show: (req, res) => {
    let id = req.params.id;
    let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
    let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));

    DropdownMapper.findOne({
      id: id
    }).then(dropdownObj => {
      let de = deFile[dropdownObj.name];
      let fr = frFile[dropdownObj.name];
      res.ok({
        data: dropdownObj,
        de: de,
        fr: fr
      });
    });
  },

  delete: (req, res) => {
    let id = req.params.id;
    let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
    let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));

    DropdownMapper.findOne({
      id: id
    }).then(dropdownObj => {
      delete(deFile[dropdownObj.name]);
      delete(frFile[dropdownObj.name]);

      DropdownMapper.delete({
        id: id
      }).then(response => {
        res.ok({
          data: response,
        });
      });
    });
  },

  update: (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let obj = data.dropdown;
    let de = data.de;
    let fr = data.fr;
    let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
    let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));

    DropdownMapper.findOne({
      id: id
    }).then(dropdownObj => {
      delete(deFile[dropdownObj.name]);
      delete(frFile[dropdownObj.name]);
      deFile[obj.name] = de;
      frFile[obj.name] = fr;

      DropdownMapper.update({
        id: id
      }).set({
        name: obj.name
      }).then(response => {
        res.ok({
          data: response,
        });
      });
    });
  }
};
