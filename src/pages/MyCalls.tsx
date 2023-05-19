import React from "react";

import {getAuth} from "firebase/auth";
import {getFirestore, getDocs, query, where, collection} from "firebase/firestore";

import {CallRequest} from "src/entities";

async function getMyCalls(): Promise<CallRequest[]> {
  const auth = getAuth();
  const firestore = getFirestore();

  if (!auth.currentUser) throw new Error("User not signed in");
  const userId = auth.currentUser.uid;

  const col = collection(firestore, "callRequests");

  const q = query(col, where("caller.id", "==", userId));
  const res = (await getDocs(q)).docs.map((doc) => doc.data());

  return res as CallRequest[];
}

const MyCalls = (): JSX.Element => {
  const [myCalls, setMyCalls] = React.useState<CallRequest[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await getMyCalls();
      setMyCalls(res);
    })();

  }, []);

  return (
    <div id="my-calls" className="flex flex-col justify-center items-center gap-5 w-screen h-screen">

      <h5 className="text-4xl">My Calls</h5>

      <div className="flex flex-col gap-3">
        {myCalls.map(item => (
          <button key={item.id} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
// <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Call 1</button>

// <input id="name" className="border-2 border-gray-400 text-center rounded" type="text" />
export default MyCalls;
