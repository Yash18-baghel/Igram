import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpValidation } from "@/lib/validation";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount, useGoogleSignUp, useSignInAccount } from "@/lib/react-query/queries";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { IGoogleJwtPayload } from "@/types";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: googleSignUp, isLoading: isgoogleLoggedIn } = useGoogleSignUp();
  const { mutateAsync: signInAccount, isLoading: isSignIn } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof signUpValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {

        toast({ title: "Sign up failed. Please try again." })
        return;
      }

      const session = await signInAccount({ email: user.email, password: user.password })

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account", });
        navigate('/sign-in');
        return;
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset()

        navigate("/")
      } else {
        toast({ title: "Login failed. Please try again.", });

        return;
      }
    } catch (er) {
      console.log(er);
    }
  }

  const handleGoogleSignUp = async (credentialResponse: any) => {
    try {
      const emailData = jwtDecode<IGoogleJwtPayload>(credentialResponse.credential || '');
      const user = {
        name: emailData?.given_name + emailData?.family_name,
        username: emailData?.given_name + emailData?.family_name,
        picture: emailData?.picture,
        email: emailData.email
      }

      const newUser = await googleSignUp(user);
      if (!newUser) {

        toast({ title: "Sign up failed. Please try again." })
        return;
      }

      const session = await signInAccount({ email: user.email, password: user.email })

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account", });
        navigate('/sign-in');
        return;
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset()

        navigate("/")
      } else {
        toast({ title: "Login failed. Please try again.", });

        return;
      }
    } catch (er) {
      console.log(er);
    }

  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col pt-14">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-3">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="Enter Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="Enter username..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" placeholder="Enter email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" placeholder="Enter password..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-center flex-1">
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
            />
          </div>
          <Button type="submit" className="shad-button_primary">
            {
              isCreatingAccount || isSignIn || isUserLoading || isgoogleLoggedIn ?
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div> : "Sign up"
            }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-1">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm