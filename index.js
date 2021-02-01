// code away!

const server = require("./server.js");

const port = process.env.PORT || 5000;

server.get('/', (req, res) => {
    res.status(200).json({Hello: 'Web 23!'});
})

server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});