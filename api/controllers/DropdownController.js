/**
 * DropdownController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    index: (req, res) => {
      Dropdown.find().populate('values', { sort: 'name ASC' }).then(dropdownList => {
        res.ok(dropdownList);
      }).catch(err => {
        res.badRequest(err);
      });
    },
  
  };
  