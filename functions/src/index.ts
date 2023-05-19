import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {FieldValue} from "firebase-admin/firestore";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

interface AddMoneyRequest {
  userId: string;
  amount: number;
}

export const addMoney = functions.https.onCall(async (data: AddMoneyRequest) => {
  const firestore = admin.firestore();
  const doc = firestore.collection("users").doc(data.userId);

  await doc.update({
    amount: FieldValue.increment(data.amount),
  });

});

interface RequestCallRequest {
  userId: string;
  recipentId: string;
}

interface User {
  id: string;
  amount: number;
}

const AMOUNT = 800;

interface AcceptCallRequest {
  callRequestsId: string
}

export const acceptCall = functions.https.onCall(async (data: AcceptCallRequest) => {
  const firestore = admin.firestore();

  const callRequestDocRef = firestore.collection("callRequests").doc(data.callRequestsId);
  const callRequestDocData = await callRequestDocRef.get();

  if (!callRequestDocData.exists) {
    throw new functions.https.HttpsError("not-found", `callRequest ${data.callRequestsId} does not exist`);
  }

  callRequestDocRef.update({
    status: "accepted"
  });
});

export const requestCall = functions.https.onCall(async (data: RequestCallRequest) => {
  const firestore = admin.firestore();
  firestore.settings({ignoreUndefinedProperties: true});

  const userDocRef = firestore.collection("users").doc(data.userId);
  const userDocData = (await userDocRef.get()).data() as User;

  const recipentDocData = (await firestore.collection("users").doc(data.recipentId).get()).data();

  if (userDocData.amount < AMOUNT) {
    throw new functions.https.HttpsError("aborted", "user balance is lower than required amount", {
      expectedAmount: AMOUNT,
      currentAmount: userDocData.amount
    });
  }

  firestore.collection("callRequests").doc().set({
    status: "waiting",
    caller: userDocData,
    recipent: recipentDocData,
  });

  userDocRef.update({
    amount: FieldValue.increment(-AMOUNT),
  });

});

