#!/usr/bin/env node

'use strict'

/* global cp, exec, mkdir, test */

require('shelljs/global')

const fs = require('fs')
const path = require('path')
const resolve = require('resolve').sync

let coreFiles = {
  'mocha.js': 'mocha/mocha.js',
  'mocha.css': 'mocha/mocha.css',
  'promise.js': 'es6-promise/dist/es6-promise.min.js',
  'index.html': 'rdf-ext-browser-test/test/index.html'
}

let buildPath = '.build/browser-test'

function copyModuleFiles (files) {
  Object.keys(files).forEach((target) => {
    cp(resolve(files[target], {basedir: process.cwd()}), path.join(buildPath, target))
  })
}

let packageJson = JSON.parse(fs.readFileSync('package.json').toString())

let packageFiles = {}

let packageConfig = packageJson['rdf-ext-browser-test']

if (packageConfig && packageConfig.files) {
  packageFiles = packageConfig.files
}

if (!test('-d', buildPath)) {
  mkdir('-p', buildPath)
}

copyModuleFiles(coreFiles)
copyModuleFiles(packageFiles)

exec('browserify test/*.js -d > ' + path.join(buildPath, 'index.js'))
