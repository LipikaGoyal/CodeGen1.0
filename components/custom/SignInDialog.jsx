import React, { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { GoogleLogin } from "@react-oauth/google";
import { UserDetailsContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";

function SignInDialog({ openDialog, closeDialog }) {
    const {userDetails, setUserDetails} = useContext(UserDetailsContext);
    const CreateUser=useMutation(api.users.CreateUser);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        console.log("Token response:", tokenResponse);
        const userInfo = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        console.log("Google user info:", userInfo.data);
        const user = userInfo.data;

        const userId = await CreateUser({
            name: user.name,
            email: user.email,
            picture: user.picture,
            uid: uuid4()
        });

        console.log("Created user ID:", userId);

        if (typeof window !== undefined) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        setUserDetails(userInfo.data);
        closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
            <div className="flex flex-col items-center justify-center gap-3 ">
              <h2 className="font-bold text-2xl text-white text-center">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center text-gray-400">{Lookup.SIGNIN_SUBHEADING}</p>
              <Button className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
              onClick={googleLogin}>
                Sign In with Google
              </Button>
              <p className="mt-2 text-center text-gray-400">{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
            </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
