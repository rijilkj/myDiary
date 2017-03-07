
// call the packages we need
var express    = require('express');   
var session = require('express-session');     // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var md5 = require('md5');
var sanitize = require('mongo-sanitize');
var validator = require('validator');
var empty = require('is-empty');
var Regex = require("regex");
var cors = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret: 'rijildiary',
                resave: false,
                saveUninitialized: true,
                cookie: {secure: false,
                        httpOnly: false }}));
 

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
   }));

var port = process.env.PORT || 3000;        // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/note'); // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


router.get('/getNote', function(req, res) {
    res.json({ message: 'your notes are here' });   
});

var Customers= require('./app/models/user');
var Notes= require('./app/models/notes');

try {

    /* ################## signUp method begin here ################ */

    router.route('/signup')
         .post(function(req, res) {
           
            
            var user = new Customers();      // create a new instance of the Bear model
            user.email = (req.body.email)?sanitize(req.body.email):''; 
            user.password = (req.body.password)?md5(req.body.password):''; 
            user.createddate = Math.floor(new Date() / 1000);
            var token=md5(Math.floor(new Date() / 1000));
            user.token_key.push(token);
   
            // var validator = require("email-validator");
            var inputError = [];   
            var inputErrorCount=null; 
            /* extract username from email */
            var username= user.email;
            var usernameMatch = username.match(/^([^@]*)@/);
            user.username = usernameMatch?usernameMatch[1] : null;

            /* check email validation */
            
            if (!validator.isEmail(user.email)){
                inputError.push("Invalid email");
            } 

            if (req.body && typeof req.body.password === 'undefined'){
                 inputError.push("Invalid Password");
            }else if (validator.isEmpty(req.body.password)){
                inputError.push("Invalid Password");
            } 

            if (empty(inputError)){

                Customers.find({email : user.email}, function (err, docs) {
                if (docs.length){
                    
                    res.send(400, {status:0, message: 'Email already exist',  data:'', token:'', error:'Email already exist'});
                }else{
                    
                        var userSession=req.session;
                        /** set user session **/
                        userSession.user= user.email;
 
                        user.save(function(err) {
                        if (err)
                            res.send(err);
  
                        res.send(200, {status:1, message: 'success', data:user.username, token:token, error:''});
                        });
                }
               });
            }else{
                res.send(400, {status:0, message: JSON.stringify(inputError), data:'', token:'', error:JSON.stringify(inputError)});
            }
      
        }) ;


      /* ################## signIn method begin here ################ */

    router.route('/signin')
     
     .post(function(req, res) {
             
            user = [];      // create a new instance of the Bear model
            user.email = (req.body.email)?sanitize(req.body.email):''; 
            user.password = (req.body.password)?md5(req.body.password):''; 
            user.createddate = Math.floor(new Date() / 1000);
            var token=md5(Math.floor(new Date() / 1000));

            // var validator = require("email-validator");
            var validator = require('validator');
            var empty = require('is-empty');

            var inputError = [];   
            var inputErrorCount=null; 

            /* check email validation */
            if (!validator.isEmail(user.email)){
                inputError.push("Invalid email");
            } 

            if (req.body && typeof req.body.password === 'undefined'){
                 inputError.push("Invalid Password");
            }else if (validator.isEmpty(req.body.password)){
                inputError.push("Invalid Password");
            } 
            if (empty(inputError)){
                Customers.findOne({email : user.email,password : user.password}, function (err, docs) {
                    if (err)
                        res.send(err);
                    if (!empty(docs)){
                         
                         /** initialize session */
                        var userSession=req.session;
                        /** set user session **/
                        userSession.user= user.email;
                        Customers.update({email: docs.email},{$push:{token_key:token}}, function (err, result) {
                          if (err) throw err;
                          console.log(result);
                       });

                        res.send(200, {status:1, message: 'success', data:docs.username, token:token, error:''});
                    }else{ 
                        res.send(200, {status:0, message: 'username and password is not matching', data:'', token:'', error:'Invalid username or password'});
                    }
               });
            }else{
                res.send(200, {status:0, message: JSON.stringify(inputError), data:'', token:'', error:inputError});
            }
      
        }) ;

    /*######## CreateNote method start here ##########**/
    router.route('/createNote')
        .post(function(req, res) {
            var note = new Notes();      // create a new instance of the Note model
            note.title = (req.body.title)?sanitize(req.body.title):'No Title'; 
            note.color = (req.body.color)?sanitize(req.body.color):'#ffffff'; 
            note.value = (req.body.value)?sanitize(req.body.value):''; 
            note.createDate= Math.floor(new Date() / 1000);
            note.updateDate= Math.floor(new Date() / 1000);
            var token = sanitize(req.body.token);
            var userSession=req.session;
            var sessionEmail= sanitize(userSession.user);
            
            Customers.findOne({token_key : token}, function (err, docs) {
                    if (err)
                        res.send(err);
                    if (!empty(docs) && !empty(docs.email)){
                        note.userEmail = docs.email;
                        note.save(function(err, savedNote) {
                            if (err)
                                res.send(err);
                            else{
                                res.send(200, {status:1, title: note.title, color:note.color, value:note.value, createDate:note.createDate,updateDate:note.updateDate, _id:savedNote.id, id:savedNote.id}); 
                            }
                        });
                    }else{
                        res.send(204, {status:0});
                    }
            });
    }) ;

    /*######## UpdateNote method start here ##########**/
    router.route('/updateNote')
        .post(function(req, res) {
            
            var title = (req.body.title)?sanitize(req.body.title):'No Title'; 
            var color = (req.body.color)?sanitize(req.body.color):'#ffffff'; 
            var value = (req.body.value)?sanitize(req.body.value):''; 
            var id    = (req.body._id)?sanitize(req.body._id):1; 
            var updateDate= Math.floor(new Date() / 1000);
            var token = sanitize(req.body.token);
            var userSession=req.session;
            var sessionEmail= sanitize(userSession.user);
            Customers.findOne({token_key : token}, function (err, docs) {
                    if (err)
                        res.send(err);
                    if (!empty(docs) && !empty(docs.email)){
                        Notes.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {$set: {title:title,color:color,value:value,updateDate:updateDate}},{ new: true }, function(err, updatedNote) {
                            if (err)
                                res.send(err);
                            else{
                                res.send(200, {status:1, title: updatedNote.title, color:updatedNote.color, value:updatedNote.value, createDate:updatedNote.createDate,updateDate:updatedNote.updateDate, _id:updatedNote.id, id:updatedNote.id}); 
                            }
                        });
                    }else{
                        res.send(204, {status:0});
                    }
            });
    }) ;

    /*######## UpdateNote method start here ##########**/
    router.route('/getNotes')
        .get(function(req, res) {   
            
            var pagination = (req.query.pagination)?sanitize(req.query.pagination):0; 
            var perPage= 8;
            var start= perPage*pagination;
            var userSession=req.session;
            var sessionEmail= sanitize(userSession.user);
            var token = sanitize(req.query.token);
            Customers.findOne({token_key : token}, function (err, docs) {
                    if (err)
                        res.send(err);
                    if (!empty(docs) && !empty(docs.email)){
                        Notes.find({userEmail:docs.email}).sort({ _id: -1}).skip(start).limit(perPage).exec(function(err, notes){
                          if(err || !notes){ 
                            res.send(err);
                          }else{
                             
                            res.send(200, {notes});
                          }
                        });
                    }else{
                        res.send(204, {status:0});
                    }
            });
    }) ;

  /*######## getFilteredNotes method for search notes start here ##########**/
    router.route('/getFilteredNotes')
        .get(function(req, res) {   
            
            var pagination = (req.query.pagination)?sanitize(req.query.pagination):0; 
            var search_key = (req.query.search_key)?sanitize(req.query.search_key):0; 
            var perPage= 8;
            var start= perPage*pagination;
            var userSession=req.session;
            var token = sanitize(req.query.token);
            var sessionEmail= sanitize(userSession.user);
            Customers.findOne({token_key : token}, function (err, docs) {
                    if (err)
                        res.send(err);
                    if (!empty(docs) && !empty(docs.email)){

                        Notes.find({userEmail: docs.email , $or: [{title: new RegExp(search_key, 'i') },{value: new RegExp(search_key, 'i')}]}).sort({ _id: -1}).skip(start).limit(perPage).exec(function(err, notes){
                          if(err || !notes){ 
                            res.send(err);
                          }else{
                             
                            res.send(200, {notes});
                          }
                        });
                    }else{
                        res.send(204, {status:0});
                    }
            });
    }) ;


   /*######## DeleteNote method start here ##########**/
    router.route('/deleteNote')
        .post(function(req, res) {
            
             
            var id    = (req.body._id)?sanitize(req.body._id):1; 
            var userSession=req.session;
            var sessionEmail= sanitize(userSession.user);
            var token = sanitize(req.body.token);
            Customers.findOne({token_key : token}, function (err, docs) {
                    if (err)
                        res.send(err);
                    if (!empty(docs) && !empty(docs.email)){
                        Notes.remove({ $and: [{_id: mongoose.Types.ObjectId(id)},{userEmail:docs.email}]}, function(err, result) {
                            if (err)
                                res.send(err);
                            else{
                                if(empty(result)) {
                                res.send(200, {status:0, _id: id, msg : "Record can not delete.permission issue is there."}); 
                                }
                                res.send(200, {status:1, _id: id, msg : "Successfully one record deleted.",result}); 
                            }
                        });
                    }else{
                        res.send(204, {status:0});
                    }
            });
    }) ;

    /** logout method start here **/

    router.route('/logOut')
        .post(function(req, res) {
            
            var token = sanitize(req.body.token);
            Customers.findOne({token_key : token}, function (err, docs) {
                    if (err)
                        res.send(err);
                    if (!empty(docs) && !empty(docs.email)){
                        Customers.update({token_key:token},{$pull: {token_key:token}}, function(err, result) {
                            if (err)
                                res.send(err);
                            else{
                                if(empty(result)) {
                                res.send(200, {status:0,  msg : "Token can not be removed.permission issue is there."}); 
                                }
                                res.send(200, {status:1, msg : "Token Successfully removed."}); 
                            }
                        });
                    }else{
                        res.send(204, {status:0});
                    }
            });
    }) ;

 } catch (ex) {
    callback(new Error(ex));
 }

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);



