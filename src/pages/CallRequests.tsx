import React from "react";

import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router";
import {getFirestore, getDocs, query, where, collection} from "firebase/firestore";

import {CallRequest} from "src/entities";
import {getFunctions, httpsCallable} from "firebase/functions";

async function getCallRequests(): Promise<CallRequest[]> {
  const auth = getAuth();
  const firestore = getFirestore();

  if (!auth.currentUser) throw new Error("User not signed in");
  const userId = auth.currentUser.uid;

  const col = collection(firestore, "callRequests");
  const q = query(col, where("recipent.id", "==", userId));
  const res = (await getDocs(q)).docs.map((doc) => doc.data());

  return res as CallRequest[];
}

async function acceptCall(callRequestId: string) {
  const functions = getFunctions();
  const acceptCallFunc = httpsCallable(functions, "acceptCall");
  await acceptCallFunc({callRequestId});
}


const CallRequests = (): JSX.Element => {
  const [callRequests, setCallRequests] = React.useState<CallRequest[]>([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      const res = await getCallRequests();
      setCallRequests(res);
    })();

  }, []);

  const acceptCallRequest = async (callRequestsId: string) => {
    await acceptCall(callRequestsId);
    navigate("/video-chat");
  };

  return (
    <div id="call-requests" className="flex flex-col justify-center items-center gap-5 w-screen h-screen">

      <h5 className="text-4xl">Call Requests</h5>

      <div className="flex flex-col gap-3">
        {callRequests.map(item => (
          <button key={item.id} onClick={() => acceptCallRequest(item.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {item.caller.id}
          </button>
        ))}
      </div>

    </div>
  );
};

// <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Call 1</button>
// <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Call 1</button>
// <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Call 1</button>

// <input id="name" className="border-2 border-gray-400 text-center rounded" type="text" />
export default CallRequests;
