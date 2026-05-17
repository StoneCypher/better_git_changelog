#!/usr/bin/env node

const api  = require('./index.js');
const i18n = require('./i18n.js');

const { program } = require('commander');



function prescan_ui_lang(argv) {
  const i = argv.findIndex(a => a === '--ui-lang' || a === '-u');
  return (i !== -1 && argv[i + 1]) ? argv[i + 1] : null;
}

const uiLocale = i18n.detect_ui_locale(prescan_ui_lang(process.argv), process.env);
const uiTr     = i18n.make_translator(uiLocale);
const ut       = uiTr.t;

if (uiTr.unsupported) {
  console.error(ut('ui', 'errUnknownLocale', { code: uiTr.unsupported }));
}



program
  .name('better_git_changelog')
  .helpOption('-h, --help', ut('ui', 'optHelp'))
  .option('-l, --long-form',             ut('ui', 'optLongForm'))
  .option('-s, --short-form',            ut('ui', 'optShortForm'))
  .option('-S, --short-length <count>',  ut('ui', 'optShortLength'))
  .option('-b, --both-forms [filename]', ut('ui', 'optBothForms'))
  .option('-f, --filename <filename>',   ut('ui', 'optFilename'), 'CHANGELOG.md')
  .option('-u, --ui-lang <code>',        ut('ui', 'optUiLang'))
  .option('-c, --changelog-lang <code>', ut('ui', 'optChangelogLang'))
  .option('-t, --translator <name>',     ut('ui', 'optTranslator'));

program.configureHelp({
  formatHelp: (cmd, helper) => {
    const usage = `${ut('ui', 'usageLabel')} ${helper.commandUsage(cmd)}`;
    const width = helper.visibleOptions(cmd)
                        .reduce((w, o) => Math.max(w, helper.optionTerm(o).length), 0);
    const opts  = helper.visibleOptions(cmd)
                        .map(o => `  ${helper.optionTerm(o).padEnd(width)}  ${helper.optionDescription(o)}`)
                        .join('\n');
    return `${usage}\n\n${ut('ui', 'optionsLabel')}\n${opts}\n`;
  }
});

program.exitOverride();

try {
  program.parse();
} catch (err) {
  if (err.code === 'commander.helpDisplayed' || err.code === 'commander.help') {
    process.exit(0);
  }
  if (err.code === 'commander.unknownOption') {
    const opt = (err.message.match(/'([^']+)'/) || [])[1] || '';
    console.error(ut('ui', 'errUnknownOption', { option: opt }));
  } else {
    console.error(err.message);
  }
  process.exit(err.exitCode || 1);
}

const opts = program.opts();



const changelogLocale = opts.changelogLang || uiLocale;
const clTr            = i18n.make_translator(changelogLocale);

if (clTr.unsupported) {
  console.error(ut('ui', 'errUnknownLocale', { code: clTr.unsupported }));
}



let long  = false,
    short = false,
    fn    = opts.filename,
    fn2   = opts.bothForms,
    ulen  = opts.shortLength ?? 10;

if (fn2 === true) { fn2 = 'CHANGELOG.long.md'; }

if (opts.longForm)  { long  = true; }
if (opts.shortForm) { short = true; }
if (opts.bothForms) { short = true; long = true; }

if ( (!(long)) && (!(short)) ) { long = true; }



const data = api.scan();

if (opts.translator && opts.changelogLang) {
  const translate = require('./translate.js');
  translate.translate_reflog(data.reflog, clTr.code, opts.translator, ut);
}



if (long && short) {

  console.log(ut('ui', 'generatingWithEntries', { file: fn, n: ulen }));
  api.write_short_md(fn, true, ulen, fn2, data, clTr);

  console.log(ut('ui', 'generating', { file: fn2 }));
  api.write_long_md(fn2, data, clTr);

} else if (long) {

  console.log(ut('ui', 'generating', { file: fn }));
  api.write_long_md(fn, data, clTr);

} else if (short) {

  console.log(ut('ui', 'generatingWithEntries', { file: fn, n: ulen }));
  api.write_short_md(fn, false, ulen, undefined, data, clTr);

}



console.log(`  ${ut('ui', 'finished')}`);
