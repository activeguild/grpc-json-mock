import generate from './lib/template';
import program from 'commander';

program.parse(process.argv);

if (program.args[0]) {
  generate(program.args[0]);
}
