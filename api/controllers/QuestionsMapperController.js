/**
 * QuestionsMapperController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs');

module.exports = {
  show: async (req, res) => {
    try {
      let id = req.params.id;

      let questionObj = await QuestionsMapper.findOne({
        id: id
      });

      let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
      let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));
      let de = deFile[questionObj.question];
      let fr = frFile[questionObj.question];

      res.ok({
        data: questionObj,
        de: de || '',
        fr: fr || ''
      });
    } catch (error) {
      ErrorsLogService.logError('QuestionsMapper', `id: ${req.params.id}, ` + error.toString(), 'show', req);
    }
  },

  update: async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let de = data.de;
    let fr = data.fr;
    let questionObj = data.question;
    let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json'));
    let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json'));

    let oldObj = await QuestionsMapper.findOne({
      id: id
    });
    delete (deFile[oldObj.question]);
    delete (frFile[oldObj.question]);

    deFile[questionObj.question] = de;
    frFile[questionObj.question] = fr;
    fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2));
    fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2));

    let updatedObj = await QuestionsMapper.update({
      id: id
    }).set(questionObj);
    res.ok({
      data: updatedObj,
      de: deFile,
      fr: frFile
    });
  },
};
