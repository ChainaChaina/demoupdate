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
var Schema = mongoose.Schema; // Scheema já conectado no mongoose
mongoose.Promise = global.Promise;
mongoose.connect(uri);

MongoClient.connect(uri, (err, db) => {
        if (err) return console.log(err)
        var dbo = db.db("Caronas");


    })
    // OLA
    // ESSE É O GUIA PRATICO DO CHAINA PARA ESSE DOCUMENTO

app.listen(3000, () => {
    console.log(' CARONA running at 3000')
});

var CaronaSchema = new Schema({
    "Username": String,
    "Password": String,
    "Token": String,
    "Limite": String,
    "Vagas": String,
    "interesses": String,
})

var Carona = mongoose.model('Carona', CaronaSchema); // DEFINE O SCHEEMA COM NOME CARONA

var userSchema = new Schema({ //O QUE TEM DENTRO DELE:
    "Username": String,
    "Password": String,
    "Token": String,
    "Id": String
})

var User = mongoose.model('User', userSchema);


app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());



// Tudo que interessa vem aqui de baixo.
// Está tudo dividido, basta procurar no F a função que vcê quer fazer do CRUD


//IMPORTAR CARONA DO BD
app.get('/', async(req, res) => {
    console.log('Procurando:')
    res.send('hello world')
    await auth(req.body);

})


async function auth(req) { // função pra bater as coisas do BD, pode ser alterada pro que quiser.
    const CaronaFromDb = await Carona.findOne({ _id: req._id }); // procura pelo valor de ID criado pelo mongo automaticamente
    console.log(CaronaFromDb);
    if (CaronaFromDb == null) {
        console.log('o sistema não encontrou usuários/senha na data base.');
    }

}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// DELETE DE SEMPRE. 
app.delete('/dell', async(req, res) => { //DELETE , pelo ID
    await deleter(req.body)
})

async function deleter(req) {

    console.log(req._id)
    const UserUP = await User.deleteOne({ _id: req._id }) //atenção na QUERY aqui. Você passa objetos "{}"""
    console.log(UserUP)

}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


app.post('/posts', (req, res) => { //CREATE, CRIA A CARONA NO BD
    const cryp = req.body.Password //cria variavel com o Password.
    const acessToken = jwt.sign(cryp, process.env.token) // usa o JWT para encryptar o Password. por issso "cryp"

    var myData = new Carona({ //define Schema!
        Username: req.body.Username,
        Password: req.body.Password,
        Token: acessToken,
        Limite: req.body.Limite,
        Vagas: req.body.Vagas,
        interesses: req.body.interesses,
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



app.put('/interesse', async(req, res) => { //FUNÇÃO DA LISTA DE INTERESSE: VÊ SE TEM VAGA NO CARRO E DIMINUI AS VAGAS NO CARRO
    await updater(req.body)

})


//função de UPDATE
async function updater(req) {
    const CaronaFromDb = await Carona.findOne({ _id: req._id });
    if (CaronaFromDb.Vagas > 0) {
        await Carona.updateOne({ Vagas: CaronaFromDb.Vagas }, { $set: { Vagas: (CaronaFromDb.Vagas - 1) } })
    } else {
        console.log("Opa, acabou a vida boa. Não temos mais espaço nesse carro :(") //mensagem de que deue rror
    }
    console.log((CaronaFromDb.Vagas - 1)) // se der -1, acabou!!


}


//MARCAR INTERESSE NA CARONA
//ESSA FUNÇÃO: cira uma listta de interessados. Você passa o ID do cara que se interessou por aqui e ele add e salva a lista. 

app.put('/inte', async(req, res) => { //UPDATE
    await inte(req.body)

})


//função de UPDATE
async function inte(req) {

    const CaronaFromDb = await Carona.findOne({ _id: req._id });
    var interesses = CaronaFromDb.interesses;
    console.log(interesses);
    var NovoInteresse = req.interesse;
    console.log(NovoInteresse);
    var res = `${interesses} ${NovoInteresse}`;
    console.log(res);
    await Carona.updateOne({ interesses: CaronaFromDb.interesses }, { $set: { interesses: res } })

}




//função de GET para importar coisas do BD
// ESSA FUNÇÃO RETORNA A LISTA DE INTERESSADOS: vai mostrar no console id por id dos interessados na carona :)
app.get('/intere', async(req, res) => {
    console.log('Procurando:')
    res.send('hello world')
    await authInteresse(req.body);

})


async function authInteresse(req) { // a função que é chamada acima é esta.
    MongoClient.connect(uri, (err, db) => { // como estamos pegando algo de OUTRO BD esse mongoose garante que entramos no lugar certo
        if (err) return console.log(err)
        var dbo = db.db("users");

    })


    const UserFromDb = await User.findOne({ _id: req._id }); // procura pelo valor de ID criado pelo mongo automaticamente
    console.log(UserFromDb);
    if (UserFromDb == null) {
        console.log('o sistema não encontrou usuários/senha na data base.');
    }


}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//Agradecimentos ao Shayron por ter me ajudado em todo obstáculo