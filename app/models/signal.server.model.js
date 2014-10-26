'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  Schema = mongoose.Schema;

/**
 * SignalAssignment Schema - this will always be embedded in Signal document
 * Because different people that have self-assigned a task
 * have different roles
 * @TODO validation
 */
// see http://stackoverflow.com/questions/19635807/mongoose-sub-document-without-array
var SignalAssignmentSchemaDefinition = {
  role: Number, // from ASSIGNMENT_TYPES
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}
var SignalAssignmentSchema = new Schema(SignalAssignmentSchemaDefinition);


/**
 * ActivitySchema Schema - this will always be embedded in Signal document
 * @TODO validation
 * created after reading: http://www.waistcode.net/blog/mongodb-newsfeed-schema-design-for-entexis
 */
var ActivitySchema = new Schema({
  created: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  created_by_role:  Number, // role of created_bt user at the point of activity, values from ASSIGNMENT_TYPES or Null
  assignment: SignalAssignmentSchemaDefinition, // if created_by user explicitly has chosen to swap places with another or created_by is admin and assigns someone else
  comment: String,
  from_status: Number,
  to_status: Number,
  type: Number // see ACTIVITY_TYPE below
});

/**
 * Signal Schema
 * @TODO validation
 */
var SignalSchema = new Schema({
  type: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },

  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  assignments: [SignalAssignmentSchema],

  description: String,
  location: { type: [Number], index: '2dsphere' },
  address: String,
  status: { type: Number, default: 0 },
  images: { type: [String] },
  activities: [ ActivitySchema ]
});
SignalSchema.basePhotoPath = path.join(__dirname , "/../../public/img/signals/");
if(!fs.existsSync(SignalSchema.basePhotoPath))
  fs.mkdirSync(SignalSchema.basePhotoPath);

/**
 * Validations
 */
/* SignalSchema.path('title').validate(function(title) {
  return title.length;
}, 'Title cannot be blank');*/


/**
 * Statics
 */
SignalSchema.statics = {
  load: function(id, cb) {
    this
      .findOne({_id: id})
      .populate('created_by', 'displayName') // only what we need, not sensitive fields like `salt`
      .populate('assignments.user', 'displayName') // only what we need, not sensitive fields like `salt`
      .exec(cb);
  }
};

/**
 * Method
 */
SignalSchema.methods.savePhotoFiles = function(files) {
  var basePath = SignalSchema.basePhotoPath + this._id;
  var images = []
  if(!fs.existsSync(basePath) || !fs.statSync(basePath).isDirectory()){
    fs.mkdirSync(basePath);
  }
  _.each(files, function(file, i) {
    var ext = file.name.substr(file.name.lastIndexOf('.'));
    var baseName = i + ext;
    images.push(baseName);
    var fileData = fs.readFileSync(file.path);
    fs.writeFileSync(basePath + '/' + baseName, fileData);
    fs.unlinkSync(file.path);
  })
  this.images = images
};

mongoose.model('Signal', SignalSchema);
mongoose.model('SignalAssignment', SignalAssignmentSchema);

exports.constants = {
  ACTIVITY_TYPE: {
    COMMENT: 1,
    STATUS_CHANGE: 2,
    ASSIGNEE_SWAP: 3,
    ASSIGNEE_DROP: 4,
    ASSIGNEE_ADD: 5
  },

  SIGNAL_STATUS: {
    UNCONFIRMED: 1,
    CONFIRMED: 2,
    INPROGRESS: 3,
    CLOSED: 4,
    INVALID: 5
  },

  ASSIGNMENT_TYPES: {
    OWNER: 1,
    MIDDLEMAN: 2,
    CULPRIT: 3
  }
}
