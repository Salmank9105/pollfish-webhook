const express = require("express");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://byte-rewards-d9589-default-rtdb.firebaseio.com"
});

const db = admin.database();

app.get("/callback", async (req, res) => {
  const userId = req.query.user_id;
  const reward = parseInt(req.query.reward_value || "0");

  if (!userId || !reward) {
    return res.status(400).send("Missing user_id or reward_value");
  }

  try {
    const userRef = db.ref(`users/${userId}/points`);
    const snapshot = await userRef.once("value");
    const currentPoints = snapshot.val() || 0;
    await userRef.set(currentPoints + reward);
    res.send("Points updated!");
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).send("Failed to update points");
  }
});

app.listen(port, () => {
  console.log(`✅ Pollfish Webhook running on port ${port}`);
});
