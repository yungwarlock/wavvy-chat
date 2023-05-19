import React from "react";

import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router";
import {getFunctions, httpsCallable} from "firebase/functions";


async function requestCall(recipentId: string) {
  const auth = getAuth();
  const functions = getFunctions();

  if (!auth.currentUser) throw new Error("User not signed in");
  const userId = auth.currentUser.uid;

  const requestCallFunc = httpsCallable(functions, "requestCall");
  await requestCallFunc({userId, recipentId});

  console.log(`Requested a call by ${userId} to ${recipentId}`);
}

const RequestCall = (): JSX.Element => {
  const [recipent, setRecipent] = React.useState<string>("");

  const navigate = useNavigate();

  const sendRequest = async () => {
    await requestCall(recipent);
    navigate("/video-chat");
  };

  return (
    <div id="request-call" className="flex flex-col justify-center items-center gap-5 w-screen h-screen">

      <h5 className="text-4xl">Request Call</h5>

      <input type="text" value={recipent} onChange={(event) => setRecipent(event.target.value)} className="border-2 border-gray-200 rounded" />
      <button onClick={sendRequest} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Request</button>

    </div>
  );
};


// <input id="name" className="border-2 border-gray-400 text-center rounded" type="text" />
export default RequestCall;
