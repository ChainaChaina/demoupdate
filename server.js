require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient;

const jwt = require('jsonwebtoken');
app.use(express.json()); //deixa o app usar JSON


const uri = "mongodb+srv://Lucasbm777:senhasenha@data-nwe37.mongodb.net/test?retryWrites=true&w=majority"


var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

MongoClient.connect(uri, (err, db) => {
    if (err) return console.log(err)
    var dbo = db.db("test");

    db.close();

})


app.listen(3000, () => {
    console.log('running at 3000')
});

var userSchema = new Schema({
    "Username": String,
    "Password": String,
})

var User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());


app.get('/', async (req, res) => {
    console.log('hello mundo')
    res.send('hello world')
    await auth();

})

const post = [
    {
        username: 'Lucas',
        password: 'senha123'
    },
    {
        username: 'caio',
        password: 'senha1234'
    }
];

app.get('/log', authenticateToken, (req, res) => {
    res.json(post.filter(post => post.username === req.user.name))
})



//login com JWT
app.post('/login', (req, res) => {
    //authentica user:
    const username = req.body.username
    const user = { name: username }

    const acessToken = jwt.sign(user, process.env.token)
    res.json({ acessToken: acessToken })
})

app.post('/posts', (req, res) => {
    var myData = new User({
        Username: req.body.Username,
        Password: req.body.Password
    });
    console.log(myData.Username);
    myData.save()
        .then(item => {
            console.log(req.body)
            console.log(myData)
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});



// function auth (){ //desce tudo com username "giu"
//     MongoClient.connect(uri, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("test");
//         var query = { Username: "Lucas", Password: "senha123" };
//        const queryUser =  dbo.collection("users").findOne(query).exec( function(err, user ){
//            console.log(user);
//        });

//     })} 
//formik = completo mas complexo

async function auth() {
    const userFromDb = await User.findOne({ Username: 'Millena', Password: '12345' });
    console.log(userFromDb);
    if (userFromDb == null) {
        console.log('o sistema não encontrou usuários/senha na data base.');
    }

}
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) //token não encontrado

    jwt.verify(token, process.env.token, (err, user)=>{
        if (err) return res.sendStatus(403) //Token encontrado mas não correto
        req.user =  user
        next()
    })
}


//Shcma definido da pra usar o método acima.