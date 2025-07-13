const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log('Pollfish Webhook Hit:', data);

  // TODO: Firebase update logic here
  res.status(200).send('Webhook received!');
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
