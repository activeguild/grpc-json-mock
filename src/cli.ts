import generate from './lib/template';
import program from 'commander';

const _list = (val: string | undefined): string[] | undefined => {
  return val ? val.split(',') : [];
};

program
  .option('-i, --includedir <items>', 'Import Proto path.', _list)
  .parse(process.argv);

if (program.args[0]) {
  generate(program.args[0], program.includedir);
}
