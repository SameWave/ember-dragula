/* eslint-env node */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-dragula',

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    app.import('vendor/dragula.css');
    app.import('vendor/dragula.js');
  },

  treeForVendor(vendorTree) {
    let trees = [];
    let dragulaTree = new Funnel(path.dirname(require.resolve('dragula')) + '/dist', {
      files: ['dragula.js', 'dragula.css']
    });

    dragulaTree = map(dragulaTree, content => `if (typeof FastBoot === 'undefined') { ${content} }`);

    if (vendorTree !== undefined) {
      trees.push(vendorTree);
    }

    trees.push(dragulaTree);

    return new MergeTrees(trees);
  },

  isDevelopingAddon() {
    return false;
  }
};
