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
      if (dropdownObj != undefined) {
        let de = deFile[dropdownObj.name];
        let fr = frFile[dropdownObj.name];
        res.ok({
          data: dropdownObj,
          de: de,
          fr: fr
        });
      } else {
        res.badRequest({
          message: 'Data not Found'
        });
      }
    });
  },

  delete: (req, res) => {
    try {
      let id = req.params.id;
      let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
      let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));

      DropdownMapper.findOne({
        id: id
      }).then(dropdownObj => {
        delete (deFile[dropdownObj.name]);
        delete (frFile[dropdownObj.name]);

        fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2));
        fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2));

        DropdownMapper.destroy({
          id: id
        }).then(response => {
          res.ok({
            data: response,
          });
        });
      });
    } catch (error) {
    }
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
      delete (deFile[dropdownObj.name]);
      delete (frFile[dropdownObj.name]);
      deFile[obj.name] = de;
      frFile[obj.name] = fr;

      fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2));
      fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2));

      DropdownMapper.update({
        id: id
      }).set({
        name: obj.name
      }).then(response => {
        res.ok({
          data: response,
          de: deFile,
          fr: frFile
        });
      }).catch(error => {
      })
    }).catch(error => {
    })
  },

  positionSort: async (req, res) => {
    let data = req.body;
    try {
      data.forEach(async val => {
        await DropdownMapper.update({
          id: val.id
        }).set({
          position: val.position
        });
      });

      res.ok(data);
    }
    catch (error) {
    }
  }
};
