'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var ActivitySchema = new Schema({
  created: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  status: Number,
  type: Number // COMMENT or TRANSITION
});

/**
 * Article Schema
 */
var SignalSchema = new Schema({
  type: String,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },

  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  handled_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],

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
    }).populate('created_by handled_by').exec(cb);
  }
};

mongoose.model('Signal', SignalSchema);

exports.constants = {
  ACTIVITY_TYPE: {
    COMMENT: 1,
    TRANSITION: 2
  },

  SIGNAL_STATUS: {
    OPEN: 1,
    INPROGRESS: 2,
    CLOSED: 3,
    INVALID: 4
  }
}

