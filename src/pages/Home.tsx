import React from "react";

import {useNavigate} from "react-router";

import {getAuth} from "firebase/auth";
import {getFirestore, collection, doc, getDoc} from "firebase/firestore";
import {User} from "src/entities";

async function fetchUserInfo() {
  const auth = getAuth();
  const firestore = getFirestore();

  if (!auth.currentUser) throw new Error("User not signed in");
  const userId = auth.currentUser.uid;

  const col = collection(firestore, "users");

  const docData = await getDoc(doc(col, userId));

  if (!docData.exists()) throw new Error("User does not exist");

  return docData.data() as User;
}


const Home = (): JSX.Element => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [userInfo, setUserInfo] = React.useState<User | null>(null);

  React.useEffect(() => {
    setLoading(true);

    (async () => {
      const res = await fetchUserInfo();
      setUserInfo(res);
      setLoading(false);
    })();

  }, []);

  return (
    <div id="home" className="flex flex-col items-center gap-1 w-full pt-2 h-screen">
      <h3 className="text-3xl font-semibold">Home</h3>

      <div id="container" className="flex flex-col justify-center items-center gap-10 text-center w-full h-full">

        <h5 className="text-3xl">My account</h5>

        {loading ?
          <div>Loading...</div> :
          <div id="user-info">
            <p>UID: {userInfo?.id}</p>
            <p>Balance: {userInfo?.amount} coins</p>
          </div>
        }

        <div id="user-actions" className="flex flex-col gap-2">
          <button onClick={() => navigate("/add-money")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Money
          </button>
          <button onClick={() => navigate("/request-call")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Request Call
          </button>
          <button onClick={() => navigate("/my-calls")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Get my calls
          </button>
          <button onClick={() => navigate("/call-requests")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View Requested calls
          </button>
        </div>

      </div>

    </div>
  );
};


export default Home;
