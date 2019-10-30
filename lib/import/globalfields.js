/*!
 * Contentstack Import
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

var request = require('../util/request');
var helper = require('../util/fs');
var log = require('../util/log');
var app = require('../../app');

var config = app.getConfig();
var globalfieldsConfig = config.modules.globalfields;
var globalfieldsFolderPath = path.resolve(config.data, globalfieldsConfig.dirName);
var globalfieldsMapperPath = path.resolve(config.data, 'mapper', 'globalfields');
var globalfieldsUidMapperPath = path.resolve(config.data, 'mapper', 'globalfields', 'uid-mapping.json');
var globalfieldsSuccessPath = path.resolve(config.data, 'mapper', 'globalfields', 'success.json');
var globalfieldsFailsPath = path.resolve(config.data, 'mapper', 'globalfields', 'fails.json');

if (!fs.existsSync(globalfieldsMapperPath)) {
   mkdirp.sync(globalfieldsMapperPath);
}

function importGlobalFields () {
  this.fails = [];
  this.success = [];
  this.snipUidMapper = {};
  this.globalfields = helper.readFile(path.resolve(globalfieldsFolderPath, globalfieldsConfig.fileName));
  if (fs.existsSync(globalfieldsUidMapperPath)) {
    this.snipUidMapper = helper.readFile(globalfieldsUidMapperPath);
    this.snipUidMapper = this.snipUidMapper || {};
  }
  this.requestOptions = {
    uri: config.host + config.apis.globalfields,
    headers: config.headers,
    method: 'POST'
  };
}

importGlobalFields.prototype = {
  start: function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      if(self.globalfields == undefined) {
        log.success('No globalfields Found');
        return resolve();
      }
      var snipUids = Object.keys(self.globalfields);
      return Promise.map(snipUids, function (snipUid) {
        var snip = self.globalfields[snipUid];
        if (!self.snipUidMapper.hasOwnProperty(snipUid)) {
          var requestOption = {
            uri: self.requestOptions.uri,
            headers: self.requestOptions.headers,
            method: self.requestOptions.method,
            json: {
                global_field: snip
            }
          };

          

          // return self.createglobalfields
          return request(requestOption).then(function (response) {
            self.success.push(response.body.global_field);
            self.snipUidMapper[snipUid] = response.body.global_field.uid;
            helper.writeFile(globalfieldsUidMapperPath, self.snipUidMapper);
            return;
          }).catch(function (error) {
            if(error.error_code === 115) {
              console.log("The Globalfields already exists in Stack");  
            }
            self.fails.push(snip);
           // log.error('globalfields failed to be imported\n' + error);
            return;
          });
        } else {
          // the globalfields has already been created
          log.success('The globalfields already exists. Skipping it to avoid duplicates!');
          return;
        }
        // import 2 globalfields at a time
      }, {
        concurrency: 2
      }).then(function () {
        // globalfields have imported successfully
        helper.writeFile(globalfieldsSuccessPath, self.success);
        log.success('globalfields have been imported successfully!');
        return resolve();
      }).catch(function (error) {
        // error while importing globalfields
        helper.writeFile(globalfieldsFailsPath, self.fails);
        log.error('globalfields import failed');
        return reject(error);
      });
    });
  }
};

module.exports = new importGlobalFields();