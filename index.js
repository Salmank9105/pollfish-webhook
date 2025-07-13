const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = require('./firebase-service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://byte-rewards-d9589-default-rtdb.firebaseio.com"
});

app.get('/callback', async (req, res) => {
  const deviceId = req.query.device_id;
  const cpa = parseInt(req.query.cpa || 0);

  if (!deviceId || !cpa) {
    return res.status(400).send('Missing parameters');
  }

  try {
    const ref = admin.database().ref(`users/${deviceId}/points`);
    const snapshot = await ref.once('value');
    const currentPoints = snapshot.val() || 0;
    await ref.set(currentPoints + cpa);
    return res.status(200).send('Points updated');
  } catch (error) {
    console.error('Error updating points:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Webhook running on port ${port}`);
});
