import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase Functions + TypeScript!");
});
