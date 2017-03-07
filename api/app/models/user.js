var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 		 = Schema.ObjectId;

var UserSchema   = new Schema({
    username: String,
    email: String,
    password:String,
    createddate:String,
//     token_key:{ type: []}
    token_key:[]
    
});

  
module.exports = mongoose.model('customers', UserSchema);