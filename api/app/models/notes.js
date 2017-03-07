var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 		 = Schema.ObjectId;

var NoteSchema   = new Schema({
    title: String,
    color: String,
    value:String,
    createDate:String,
    updateDate:String,
    userEmail:String
    
});

 
module.exports = mongoose.model('notes', NoteSchema);