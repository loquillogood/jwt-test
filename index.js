const express= require('express');
const jwt= require('jsonwebtoken');
const logger= require('morgan');    //Para ver por consola lo que está llegando al servidor

const app= express();


//middlewares 
//morgan: Ver por consola lo que va llegando al servidor
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        text: 'api works'
    });
});


app.post('/api/login', (req, res) => {
    //const { id, name, secret_key }= req.body;
    const { user }= req.body;
    //console.log(user.id);
    //const user1= {id: 3};
    const token= jwt.sign(user.id, user.secret_key);
    res.json({
        token
    });
});

app.get('/api/protected', ensureToken ,(req, res) => {   
    jwt.verify(req.token, 'my_secret_key', (err, data) => {
        if (err){
            res.sendStatus(403)
        } else {
            res.json({
                text: 'protected',
                data
            });        
        };
    })
});

//middleware
function ensureToken (req, res, next){
    const beaderHeader= req.headers['autorization'];
    console.log(beaderHeader);
    if (typeof beaderHeader != 'undefined'){
        //se divide en un arreglo de 2 (beader y hash)
        const beader= beaderHeader.split(' ');
        //el  índice 1 contiene el hash
        const beaderToken= beader[1];
        //lo pasamos como un parámetro para la siguiente función
        req.token= beaderToken;
        next();
    }
    else {
        res.sendStatus('403');
    }
}

app.listen(3000, () => {
    console.log('Server on port 3000');  
});