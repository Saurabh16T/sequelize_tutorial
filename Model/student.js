const { sequelize, DataTypes } = require("../connection");
const bcrypt = require('bcryptjs');

// Define the model inside a function
const defineStudentModel = sequelize.define('Student', {
    fullName: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHERS'),
        defaultValue: 'MALE',
    },
    password: {
        type: DataTypes.STRING,
    },
    // isDeleted: {
    //     type: DataTypes.BOOLEAN,
    //     default: false
    // },
});

// Add the `beforeSave` hook
defineStudentModel.addHook('beforeSave', async (student) => {
    if (student.changed('password')) { // Only hash if password has changed
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt);
    }
});

// Add a custom instance method to compare passwords
defineStudentModel.prototype.comparePassword = async function (plaintextPassword) {
    return await bcrypt.compare(plaintextPassword, this.password);
};


// Export the function, not the model directly
module.exports = defineStudentModel;
