/**
 * TranslationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fs = require('fs');

module.exports = {

	index: async (req, res) => {
		try {
			let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json', 'utf8'));
			let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json', 'utf8'));

			en = Object.keys(deFile);
			let trans = [];

			en.forEach(val => {
				trans.push({
					en: val,
					de: deFile[val],
					fr: frFile[val]
				});
			});
			res.ok(trans);
		} catch (e) {
			res.badRequest(e);
		}
	},

	create: async (req, res) => {
		try {
			let data = req.body;
			let en = data.en;
			let de = data.de;
			let fr = data.fr;

			let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json', 'utf8'));
			let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json', 'utf8'));

			deFile[en] = de;
			frFile[en] = fr;

			let options = {
				encoding: 'utf-8',
				flag: 'w'
			};

			fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2), options);

			if (fr != null && fr != undefined && fr != '') {
				fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2), options);
			}

			res.ok({ message: 'Translation Created' });
		} catch (e) {
			res.badRequest(e);
		}
	},

	update: async (req, res) => {
		try {
			let data = req.body;
			let enOld = data.enOld;
			let en = data.en;
			let de = data.de;
			let fr = data.fr;

			let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json', 'utf8'));
			let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json', 'utf8'));

			delete (deFile[enOld]);
			delete (frFile[enOld]);

			deFile[en] = de;

			if (fr != null && fr != undefined && fr != '') {
				frFile[en] = fr;
			}

			let options = {
				encoding: 'utf-8',
				flag: 'w'
			};

			fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2), options);
			fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2), options);

			res.ok({ message: 'Translation Updated' });
		} catch (e) {
			res.badRequest(e);
		}
	},

	delete: async (req, res) => {
		try {
			let data = req.body;
			let en = data.en;

			let deFile = JSON.parse(fs.readFileSync('assets/langs/de.json', 'utf8'));
			let frFile = JSON.parse(fs.readFileSync('assets/langs/fr.json', 'utf8'));

			delete (deFile[en]);
			delete (frFile[en]);

			let options = {
				encoding: 'utf-8',
				flag: 'w'
			};
			fs.writeFileSync('assets/langs/de.json', JSON.stringify(deFile, null, 2), options);
			fs.writeFileSync('assets/langs/fr.json', JSON.stringify(frFile, null, 2), options);

			res.ok({ message: 'Translation Deleted' });
		} catch (e) {
			res.badRequest(e);
		}
	},
};

