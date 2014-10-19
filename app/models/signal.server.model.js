'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * ActivitySchema Schema - this will always be embedded in Signal document
 * @TODO validation
 * created after reading: http://www.waistcode.net/blog/mongodb-newsfeed-schema-design-for-entexis
 */
var ActivitySchema = new Schema({
  created: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  to_user: { type: Schema.Types.ObjectId, ref: 'User' }, // if user explicitly has chosen to swap places with another
  comment: String,
  from_status: Number,
  to_status: Number,
  type: Number // see ACTIVITY_TYPE below
});

/**
 * SignalAssignment Schema - this will always be embedded in Signal document
 * Because different people that have self-assigned a task
 * have different roles
 * @TODO validation
 */
var SignalAssignmentSchema = new Schema({
  role: Number, // from ASSIGNMENT_TYPES
  user: { type: Schema.Types.ObjectId, ref: 'User' }
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
  handled_by: [SignalAssignmentSchema],

  description: String,
  location: { type: [Number], index: '2dsphere' },
  address: String,
  status: { type: Number, default: 0 },
  images: { type: [String] },
  activities: [ ActivitySchema ]
});

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
    this.findOne({
      _id: id
    }).populate('created_by handled_by.user').exec(cb);
  }
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

