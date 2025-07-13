const express = require('express');
const admin = require('firebase-admin');
const app = express();

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://byte-rewards-d9589-default-rtdb.firebaseio.com'
});

app.get('/pollfish', async (req, res) => {
  const uid = req.query.custom1;
  const reward = parseInt(req.query.reward_value || "0");

  if (!uid || reward <= 0) {
    return res.status(400).send("❌ Invalid");
  }

  try {
    await admin.database().ref(`users/${uid}/points`).transaction((curr) => {
      return (curr || 0) + reward;
    });
    res.send(`✅ ${uid} ko ${reward} points diye gaye`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Webhook live...");
});
