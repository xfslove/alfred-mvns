'use strict';
const alfy = require('alfy');
const dateFormat = require('date-format');

const q = alfy.input;

alfy.fetch('http://search.maven.org/solrsearch/select', {
	query: {
		q,
    wt: 'json',
		rows: 20
	}
}).then(data => {
  const items = data.response.docs
	  .map(x => {
      const mvn = `<dependency>\n  <groupId>${x.g}</groupId>\n  <artifactId>${x.a}</artifactId>\n  <version>${x.latestVersion}</version>\n</dependency>`;
      const gradle = `compile '${x.g}:${x.a}:${x.latestVersion}'`;
		  return {
			  title: `${x.g}:${x.a}:${x.latestVersion}`,
			  subtitle: `updated at ${dateFormat('yyyy-dd-MM', new Date(x.timestamp))}`,
        arg: mvn,
        mods: {
          cmd: {
            arg: mvn,
            subtitle: `copy maven dependency to clipboard`
          },
          alt: {
            arg: gradle,
            subtitle: `copy gradle dependency to clipboard`
          }
        }
		  };
	  });

  alfy.output(items);
});