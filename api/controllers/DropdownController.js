/**
 * DropdownController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs');
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('dropdownResolver', async data => {
    let count = await Dropdown.count();

    Dropdown.find().paginate({ page: data.pageNumber, limit: 10 }).populate('values', {
      sort: 'position ASC'
    }).then(dropdownList => {
      socket.emit('dropdownResolver', { count, data: dropdownList });
    }).catch(err => {
    });
  });

});

module.exports = {
  index: (req, res) => {
    Dropdown.find().populate('values', {
      sort: 'position ASC'
    }).then(dropdownList => {
      res.ok(dropdownList);
    }).catch(err => {
      res.badRequest(err);
    });
  },

  create: (req, res) => {
    let data = req.body;
    Dropdown.create(data).populate('values').then(response => {
      res.ok(response);
    }).catch(err => {
    })
  },

  update: async (req, res) => {
    let data = req.body;
    let de = data.de;
    let fr = data.fr;
    let en = data.values[data.values.length - 1].name;
    let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json', 'utf8'));
    let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json', 'utf8'));

    deFile[en] = de;
    frFile[en] = fr;

    let options = {
      encoding: 'utf-8',
      flag: 'w'
    };
    fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2), options);
    fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2), options);

    delete (data.de);
    delete (data.fr);

    await Dropdown.update({
      id: req.params.id
    }).set({
      values: data.values
    })
    let updatedDropdown = await Dropdown.findOne({
      id: req.params.id
    }).populate('values');

    res.created({
      updatedDropdown,
      de: deFile,
      fr: frFile
    });
  }

};
