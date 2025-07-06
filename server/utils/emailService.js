// utils/emailService.js
const nodemailer = require('nodemailer');

const sendCompletionEmail = async (email, tasks) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const taskList = tasks.map(task => `- ${task.content}`).join('\n');
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Completed Tasks',
    text: `You've completed these tasks:\n\n${taskList}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendCompletionEmail };