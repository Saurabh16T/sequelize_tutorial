const router = require("express").Router();
const Model = require('../Model/index');
const utility = require('../common/utis');
const {userAuth} = require('../common/auth');

router.post('/login', async (req, res) => {
    try {
        // Find the student
        const student = await Model.Student.findOne({
            where: { email: req.body.email, /* isDeleted: false */ },
        });

        if (!student) {
            return res.status(404).json({ error: "Account not found" });
        }

        // Compare the password
        const isMatch = await student.comparePassword(req.body.password); // Ensure comparePassword is an instance method
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        // Generate a random string for JTI
        const jti = utility.generateRandomString(20);

        // Update the student's JTI
        await student.update({ jti });

        // Generate the JWT token
        const token = await utility.jwtSign({
            id: student.id,
            jti: jti,
        });

        // Return the token
        return res.status(200).json({ token });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/profile', userAuth, async (req,res) => {
    let user = await Model.Student.findOne({
        where: {id:req.user.id}
    })
    return res.status(200).json({ user });

})

module.exports = router;