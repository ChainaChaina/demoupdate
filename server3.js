require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
Db = require('mongodb').Db
const MongoClient = require('mongodb').MongoClient;
ObjectID = require('mongodb').ObjectID; //faz o mongo trabalhar com os ID
const jwt = require('jsonwebtoken');
app.use(express.json()); //deixa o app usar JSON


const uri = "mongodb+srv://Lucasbm777:senhasenha@data-nwe37.mongodb.net/test?retryWrites=true&w=majority"


var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

MongoClient.connect(uri, (err, db) => {
    if (err) return console.log(err)
    var dbo = db.db("users");


})


app.listen(3000, () => {
    console.log('running at 3000')
});

var userSchema = new Schema({
    "Username": String,
    "Password": String,
    "Token": String,
    "Id": String
})

var User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());

//função de GET para importar coisas do BD
app.get('/', async(req, res) => {
    console.log('hello mundo')
    res.send('hello world')
    await auth();

})

app.put('/att', async(req, res) => {
    await updater(req.body)

})


app.get('/logi', authenticateToken, (req, res) => { //função no middleware pra verificar
    console.log(req.Password) //volta o Password que foi encrypitado
})


app.post('/posts', (req, res) => {
    const cryp = req.body.Password //cria variavel com o Password.
    const acessToken = jwt.sign(cryp, process.env.token) // usa o JWT para encryptar o Password. por issso "cryp"

    var myData = new User({ //define Schema!
        Username: req.body.Username,
        Password: req.body.Password,
        Token: acessToken,
        Id: ObjectID() //ID do objeto sendo salvo como string
    });
    myData.save() //salva essa porra no BD.
        .then(item => {
            console.log(req.body)
            console.log(myData)
            res.send("Name saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

async function auth() { // função pra bater as coisas do BD, pode ser alterada pro que quiser.
    const userFromDb = await User.findOne({ _id: '5e8638db4da2aa41a0d9d99d' }); // procura pelo valor de ID criado pelo mongo automaticamente
    console.log(userFromDb);
    if (userFromDb == null) {
        console.log('o sistema não encontrou usuários/senha na data base.');
    }

}


{}
//função de UPDATE
async function updater(req) {
    console.log(req.Username)
    const UserUP = await User.updateOne({ Username: "Lucas" }, { $set: { Password: req.Password } }) //atenção na QUERY aqui. Você passa objetos "{}"""
    console.log(UserUP)

}

// função que pega o token e devolve a senha.
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] //pega do header.
    const token = authHeader && authHeader.split(' ')[1] //SE achar o authHeader - explita do famoso Bearer.
    if (token == null) return res.sendStatus(401) //token não encontrado

    jwt.verify(token, process.env.token, (err, cryp) => {
        if (err) return res.sendStatus(403) //Token encontrado mas não correto
        req.Password = cryp
        next()
    })
}

//Shcma definido da pra usar o método acima.