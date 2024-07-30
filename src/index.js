require('dotenv').config()
const app = require('./server');

app.use(cors());

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Servidor iniciado na porta: ${port}`);
});