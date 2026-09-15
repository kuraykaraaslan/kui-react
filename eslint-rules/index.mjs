// eslint-rules/index.mjs — local flat-config plugin encoding the parts of
// AGENTS.md's Component Authoring Rules that are mechanically checkable.
// No publish needed; wired directly into eslint.config.mjs as `plugins.kui`.
//
// docs/dev/phase-1-ci-and-gates.md section 1.4 has the full list this was
// scoped from and why `kui/no-raw-hex-in-jsx` isn't here (audit-tokens.mjs
// already covers it, more completely, at the file level).

import useClientHeader from './use-client-header.mjs';
import noDefaultExport from './no-default-export.mjs';
import classnameUsesCn from './classname-uses-cn.mjs';
import noBareBrowserGlobalsInUi from './no-bare-browser-globals-in-ui.mjs';

const plugin = {
  rules: {
    'use-client-header': useClientHeader,
    'no-default-export': noDefaultExport,
    'classname-uses-cn': classnameUsesCn,
    'no-bare-browser-globals-in-ui': noBareBrowserGlobalsInUi,
  },
};

export default plugin;
