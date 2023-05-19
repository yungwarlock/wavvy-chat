import React from "react";
import {getFirestore, collection, doc, setDoc} from "firebase/firestore";
import {getAuth, signInAnonymously} from "firebase/auth";

async function registerUser() {
  const auth = getAuth();
  const firestore = getFirestore();

  const res = await signInAnonymously(auth);

  const col = collection(firestore, "users");

  await setDoc(doc(col, res.user.uid), {
    id: res.user.uid,
    amount: 0,
  });
}

const Register = (): JSX.Element => {
  const register = async () => {
    await registerUser();

  };

  return (
    <div id="register" className="flex flex-col justify-center items-center gap-5 w-screen h-screen">

      <h5 className="text-4xl">Register</h5>
      <button onClick={register} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
    </div>
  );
};


// <input id="name" className="border-2 border-gray-400 text-center rounded" type="text" />
export default Register;
