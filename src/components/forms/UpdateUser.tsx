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
import { editUserValidation } from "@/lib/validation";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ProfileUpdate from "@/components/shared/ProfileUpdate";
import { useUpadteUser } from "@/lib/react-query/queries";
import { IUser } from "@/types";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";

const UpdateUser = ({ user }: { user: IUser }) => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof editUserValidation>>({
        resolver: zodResolver(editUserValidation),
        defaultValues: {
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio || ''
        }
    });



    const { mutateAsync: updateUser, isLoading } = useUpadteUser();

    const handleSignup = async (value: z.infer<typeof editUserValidation>) => {
        const udpatedUser = await updateUser({
            ...value,
            userId: user?.id,
            imageId: user?.imageUrl,
            imageUrl: user?.imageUrl
        })

        if (!udpatedUser) {
            toast({ title: "User Updation Failed, Please try again later!!" })
            return;
        }

        navigate(`/profile/${user.id}`)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((handleSignup))}
                className="flex flex-col gap-5 w-full mt-4"
            >
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <ProfileUpdate
                                    fileChange={field.onChange}
                                    mediaUrl={user?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
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
                                <Input type="text" className="shad-input" {...field} />
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
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Bio</FormLabel>
                            <FormControl>
                                <Textarea className='shad-textarea curstom-scrollbar' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" className="shad-button_primary">
                        {
                            isLoading ?
                                <div className="flex-center gap-2">
                                    <Loader /> Loading...
                                </div> : "Sign up"
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default UpdateUser