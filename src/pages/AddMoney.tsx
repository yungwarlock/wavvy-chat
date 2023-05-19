import React from "react";

import {getAuth} from "firebase/auth";
import {getFunctions, httpsCallable} from "firebase/functions";


async function addMoney(amount: number) {
  const auth = getAuth();
  const functions = getFunctions();

  if (!auth.currentUser) throw new Error("User not signed in");
  const userId = auth.currentUser.uid;

  const addMoneyFunc = httpsCallable(functions, "addMoney");
  await addMoneyFunc({userId, amount});
  console.log(`Added ${amount} to ${userId}`);
}


const AddMoney = (): JSX.Element => {
  const [amount, setAmount] = React.useState<number>(0);

  const saveAmount = async () => {
    await addMoney(amount);
  };

  return (
    <div id="add-money" className="flex flex-col justify-center items-center gap-5 w-screen h-screen">

      <h5 className="text-4xl">Add Money</h5>

      <input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="border-2 border-gray-200 rounded" />
      <button onClick={saveAmount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Pay</button>

    </div>
  );
};


// <input id="name" className="border-2 border-gray-400 text-center rounded" type="text" />
export default AddMoney;
