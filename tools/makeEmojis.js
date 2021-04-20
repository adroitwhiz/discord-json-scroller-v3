/* eslint-env node */

const fs = require('fs');

const emojiCatalog = JSON.parse(fs.readFileSync(process.argv[2], {encoding: 'utf-8'}));

const allEmojis = {};

for (const category of Object.values(emojiCatalog)) {
	for (const emoji of category) {
		allEmojis[emoji.surrogates] = emoji;
	}
}

fs.writeFileSync('src/util/emojis.json', JSON.stringify(allEmojis, null, '\t'), {encoding: 'utf-8'});
