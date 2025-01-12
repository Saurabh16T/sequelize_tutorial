const express = require('express');
const app = express();
const student = require('./student');
const onboarding = require('./onboarding');

app.use('/student', student)
app.use('/onboarding', onboarding)

module.exports = app;