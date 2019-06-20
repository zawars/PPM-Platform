/**
 * ProgramController
 *
 * @description :: Server-side logic for managing Programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getActivePrograms: (req, res) => {
    Program.find({ status: 'Active' }).populateAll().then(programsList => {
      res.ok(programsList);
    }).catch(err => {
      res.badRequest(err);
    });
  },

  getProgramsByUser: (req, res) => {
    Program.find({
      programManager: req.params.id
    }).populateAll().then(response => {
      res.ok(response);
    }).catch(err => {
      res.badRequest(err);
    });
  },
};

 