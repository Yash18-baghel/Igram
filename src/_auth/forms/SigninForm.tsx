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
import { signInValidation } from "@/lib/validation";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  // Queries
  const { mutateAsync: signInAccount, isPending: isSignIn } = useSignInAccount();

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })


  // Handler
  const handleSignup = async (user: z.infer<typeof signInValidation>) => {
    try {
      
      const session = signInAccount(user)

      if (!session) {
        toast({ title: "Login failed. Please try again.", });

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
    } catch (er: any) {
      console.log(er);
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col pt-14">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-3">
          Welcome back! Please enter your details.
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          welcome! Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4"
        >

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
                  <Input type="text" className="shad-input" placeholder="Enter password..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {
              isSignIn || isUserLoading ?
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div> : "Sign up"
            }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-1">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm