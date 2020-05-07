/**
 * DocumentsController
 *
 * @description :: Server-side logic for managing Documents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  uploadFile: (req, res) => {
    req.file('attachment').upload({
      dirname: '../../uploads/docs'
    }, (err, uploadedFiles) => {
      if (err) {
        ErrorsLogService.logError('Document', err.toString(), 'uploadFile', req);
        return res.send(500, err);
      }
      return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles
      });
    });
  },

  getDocumentsByReport: (req, res) => {
    Documents.find({
      report: req.params.id
    }).populate('type').then(docsList => {
      res.ok(docsList);
    }).catch(err => {
      ErrorsLogService.logError('Document', err.toString(), 'getDocumentsByReport', req);
      res.serverError(err)
    });
  }
};
