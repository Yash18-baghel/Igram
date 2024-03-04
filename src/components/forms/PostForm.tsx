import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { z } from 'zod'
import { postValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUploader from '../shared/FileUploader'
import { Input } from '../ui/input'
import { Models } from 'appwrite'
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queries'
import { useUserContext } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../ui/use-toast'
import Loader from '../shared/Loader'

const PostForm = ({
    post,
    action
}: { post?: Models.Document; action: "Create" | "Update"; }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof postValidation>>({
        resolver: zodResolver(postValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags.join(',') : '',
        }
    })

    const { user } = useUserContext();
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();

    // Handler
    const handleSubmit = async (value: z.infer<typeof postValidation>) => {
        // ACTION = UPDATE
        if (post && action === "Update") {
            const updatedPost = await updatePost({
                ...value,
                postId: post.$id,
                imageId: post.imageId,
                imageUrl: post.imageUrl,
            });

            if (!updatedPost) {
                toast({
                    title: `${action} post failed. Please try again.`,
                });
            }
            return navigate(`/posts/${post.$id}`);
        }

        // ACTION = CREATE
        const newPost = await createPost({
            ...value,
            userId: user.id,
        });

        if (!newPost) {
            toast({
                title: `${action} post failed. Please try again.`,
            });
        }
        navigate("/");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-9 w-full max-w-5xl"
            >
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Caption</FormLabel>
                            <FormControl>
                                <Textarea className='shad-textarea curstom-scrollbar' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>File</FormLabel>
                            <FormControl>
                                <FileUploader
                                    fileChange={field.onChange}
                                    mediaUrl={post?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Add Location</FormLabel>
                            <FormControl>
                                <Input className='shad-input' type='text' {...field} />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>Add Tags(separated by comma ", ")</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='shad-input'
                                    placeholder='React, Nextjs, Nodejs'

                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button
                        type="button"
                        className="shad-button_dark_4"
                        onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                        {action} Post
                    </Button>
                </div>
            </form>

        </Form>
    )
}

export default PostForm