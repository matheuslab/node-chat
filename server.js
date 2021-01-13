const express = require('express');
const path = require('path');
const connection = require('./src/database/connection');

const app = express();
const cors = require('cors');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

//when somebody connect 
io.on('connection', async socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', await connection('chat').select('*'));

    socket.on('sendMessage', async data => {
        await connection('chat').insert({
            author: data.author, 
            message: data.message,
        });
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(process.env.PORT || 3000);