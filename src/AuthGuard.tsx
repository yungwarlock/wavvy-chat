import React from "react";

import {useNavigate} from "react-router";
import {getAuth, onAuthStateChanged} from "firebase/auth";


interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({children}: AuthGuardProps): JSX.Element => {
  const auth = getAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(true);

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/register");
      }
      setLoading(false);
    });
  }, []);



  return (
    <>{loading ? "Loading..." : children}</>
  );
};


export default AuthGuard;
