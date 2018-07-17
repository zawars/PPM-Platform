/**
 * AttachmentController
 *
 * @description :: Server-side logic for managing Attachments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  uploadFile: (req, res) => {
    req.file('attachment').upload({
      dirname: '../../uploads/'
    }, (err, uploadedFiles) => {
      if (err) {
        return res.send(500, err);
      }
      return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles
      });
    });
  },

  download: function (req, res) {
    let Path = require('path');
    let fs = require('fs');

    // If a relative path was provided, resolve it relative
    // to the cwd (which is the top-level path of this sails app)
    fs.createReadStream(Path.resolve(req.param('path'))).on('error', function (err) {
      return res.serverError(err);
    }).pipe(res);
  },

  deleteFile: (req, res) => {
    const fs = require('fs');
    fs.unlink(req.body.path, function (err) {
      if (err) return console.log(err); // handle error as you wish
      return res.json({
        message: 'file(s) deleted successfully!',
      });
    });
  },
}
