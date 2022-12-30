const express = require('express');

const router = express.Router();

router.get("/canial", async (req, res) => {
    res.status(200).json( { canial: "canial" });
});

module.exports = router;

const app = express();

app.use(router);

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});