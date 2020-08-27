/**
 * AttachmentController
 *
 * @description :: Server-side logic for managing Attachments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  uploadFile: (req, res) => {
    req.file('attachment').upload({
      dirname: '../../../uploads/'
    }, (err, uploadedFiles) => {
      if (err) {
        ErrorsLogService.logError('Attachment', err.toString(), 'uploadFile', req);
        return res.send(500, err);
      }

      if (uploadedFiles.length > 0) {
        if (uploadedFiles[0].fd.includes("..")) {
          while (uploadedFiles[0].fd.includes("..")) {
            uploadedFiles[0].fd = uploadedFiles[0].fd.replace(`..\\`, ``);
          }
        }
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
    // fs.createReadStream(process.cwd().split('\\' + process.cwd().split('\\').pop())[0] + `/uploads/${req.params.file}`).on('error', function (err) {
    //   ErrorsLogService.logError('Attachment', err.toString(), 'download', req);
    //   return res.serverError(err);
    // }).pipe(res);

    res.download(process.cwd().split('\\' + process.cwd().split('\\').pop())[0] + `/uploads/${req.params.file}`);
  },

  deleteFile: (req, res) => {
    const fs = require('fs');
    fs.unlink(process.cwd().split('\\' + process.cwd().split('\\').pop())[0] + '\\' + req.body.path, function (err) {
      if (err) return console.log(err); // handle error as you wish
      return res.json({
        message: 'file(s) deleted successfully!',
      });
    });
  },
}
