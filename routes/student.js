const router = require("express").Router();
const Model = require('../Model/index');


router.get('/', async (req, res) => {
    console.log("hello");
    try {
        // const [results] = await sequelize.query("SELECT * FROM students");
        const results = await Model.Student.findAll(); // Sequelize method to fetch all records
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ "Error": err.message });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const student = await Model.Student.findByPk(req.params.id); // Sequelize method to find by primary key
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        return res.status(200).json(student);
    } catch (err) {
        return res.status(500).json({ Error: err.message });
    }

})

router.post('/', async (req, res) => {
    try {
        console.log("body:", req.body);
        const { fullName, email, phone, dob, gender, password } = req.body;
        const now = new Date();
        const data = [fullName, email, phone, dob, gender, password, now, now];
        const result = await Model.Student.create(req.body);
        return res.status(200).json(result);
    }
    catch (err) {
        console.error('Error inserting student:', err);
        return res.status(500).json({ "Error": err.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        console.log("body:", req.body);
        const studentId = Number(req.params.id);
        const [updated] = await Model.Student.update(
            req.body,
            { where: { id: studentId } }
        );
        if (!updated) return res.status(404).json({ "Error": "Student not found" });
        const updatedStudent = await Model.Student.findByPk(studentId);
        return res.status(200).json(updatedStudent);
    }
    catch (err) {
        console.error('Error updating student:', err);
        return res.status(500).json({ "Error": err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const studentId = Number(req.params.id);
        const deleted = await Model.Student.destroy({ where: { id: studentId } });

        if (!deleted) {
            return res.status(500).json({ "Error": "Student not found" });
        }
        return res.status(200).json({ "Message": "Student successfully deleted" });
    }
    catch (err) {
        console.error('Error deleting student:', err);
        return res.status(500).json({ "Error": err.message });
    }
})

module.exports = router;