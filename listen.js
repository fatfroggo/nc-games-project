const app = require('./api/app.js')
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`)
})