/*!
 * Contentstack Import
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */


var path = require('path');
var _ = require('lodash');

var helper = require('./fs');
var app = require('../../app');

var config = app.getConfig();
var contentTypeConfig = config.modules.content_types;
var contentTypesFolderPath = path.resolve(config.data, contentTypeConfig.dirName);
//var contentTypesFolderPath = path.resolve("/home/rohit/Test-import-export/contentstack-import/_backup_381", "/content_types");
var extensionPath = path.resolve(config.data, "mapper/extensions", "uid-mapping.json");


var extension_uid_Replace = module.exports = function (schema) {
    for (var i in schema) {
      if (schema[i].data_type === 'group') {
        extension_uid_Replace(schema[i].schema);
      } else if (schema[i].data_type === 'blocks') {
        for (var block in schema[i].blocks) {
          extension_uid_Replace(schema[i].blocks[block].schema);
        }
      }else {
        if(schema[i].hasOwnProperty('extension_uid')) {
            var extension_key_value = schema[i]["extension_uid"]
            var data = helper.readFile(path.join(extensionPath));
            if(data.hasOwnProperty(extension_key_value)) {
              schema[i]["extension_uid"] = data[extension_key_value]
            }             
          }
      }
    }
  };
  