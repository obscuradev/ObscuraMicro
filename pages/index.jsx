import Link from "next/link";
import Router from "next/router";
import { auth, firebase } from "../lib/firebase";
import { useContext, useEffect } from "react";
import Store from "../Store/Context";

const index = () => {
  const { state, dispatch } = useContext(Store);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(authUser => {
      const uid = authUser.uid;
      authUtil(authUser, uid);
    });
  }, []);
  const loginHandler = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        let User = result.user;
        const uid = User.uid;
        authUtil(User, uid);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const authUtil = (User, uid) => {
    let rUser = null;
    firebase
      .database()
      .ref("/users/" + uid)
      .once("value")
      .then(res => {
        console.log("getUser");
        console.log(res.val());
        rUser = res.val();
        if (rUser) {
          console.log("here");
          Router.push("/game");
          dispatch({
            type: "LOGIN",
            payload: {
              user: {
                image: User.photoURL,
                name: User.displayName,
                email: User.email,
                ...rUser
              }
            }
          });
        } else {
          dispatch({
            type: "USER",
            payload: {
              image: User.photoURL,
              name: User.displayName,
              email: User.email
            }
          });
          Router.push({
            pathname: "/onboard",

            query: { w: uid }
          });
        }
      })
      .catch(error => {
        console.log("getUserError");
        console.log(error);
      });
  };
  return (
    <div>
      <h1>Index here bruh</h1>
      <button onClick={loginHandler}>Google Log in</button>
    </div>
  );
};

export default index;
