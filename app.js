const express = require('express');
const app = express();
const { createServer } = require('http');
const cors = require('cors');
const httpServer = createServer(app);

const port = process.env.PORT || 80;

app.use(express.static("dist"));
app.use(cors());
httpServer.listen(port, () => console.log('TUBITAK AKTIF!')); // AKTİF!

app.get('*', (req, res) => res.sendFile(__dirname + '/dist/index.html')); // BASİT WEBSİTE KURULUMU ;)