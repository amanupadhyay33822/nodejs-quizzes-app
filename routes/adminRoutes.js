const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")

router.get("/add-question/:id", async (req, res) => {
    const id = req.params.id; 
    res.render('admin/index', { id}); 
})

module.exports = router