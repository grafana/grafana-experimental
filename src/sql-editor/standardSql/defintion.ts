import { SQLLanguageDefinition } from 'sql-editor/types';

import { conf, language } from './language';



const standardSQL: SQLLanguageDefinition = {
  id: 'grafana-standard-sql',
  extensions: ['.grafana-standard-sql'],
  aliases: ['SQL'],
  mimetypes: [],
  // TODO: Should use webpack dynamic imports, e.g `import ./language`, but currently code splitting is not working in plugins 
  loader: () => Promise.resolve({ conf, language }),
};

export default standardSQL;
