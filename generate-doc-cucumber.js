#!/usr/bin/node
const path = require('path');
const fs = require('fs');
var debug = require('debug')('tests:doc');

const tpl = path.join(__dirname, 'doc/template.html');
const target = path.join(__dirname, 'doc/index.html');
const features = path.join(__dirname, 'tests/features');

const tplContent = fs.readFileSync(tpl, 'utf-8');

let filesContent = '';
fs.readdir(features, (err, files) => {
  files.filter(function(file) {
    return file.endsWith('.feature');
  }).forEach(function(file) {
    debug(file);
    let contents = fs.readFileSync(path.join(features, file), 'utf-8');
    contents = contents.replace('#language: fr','');
    filesContent += contents;
  });

  const result = tplContent.replace('CONTENT GOES HERE', filesContent);
  fs.writeFile(target, result, 'utf8', function(err) {
     if (err) return console.log(err);
     else
     console.log(
      'Cucumber HTML documentation doc/index.html generated successfully.'
      );
  });
});
