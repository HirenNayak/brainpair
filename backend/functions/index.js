const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const { checkForMatch } = require("./match/matchHandler");

exports.checkForMatch = functions.firestore
  .document("swipes/{userId}")
  .onWrite(checkForMatch);
