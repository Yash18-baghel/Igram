import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { z } from 'zod'
import { createPostValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUploader from '../shared/FileUploader'
import { Input } from '../ui/input'
import { Models } from 'appwrite'
import { useCreatePost } from '@/lib/react-query/queries'
import { useUserContext } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../ui/use-toast'

const PostForm = ({ post }: { post?: Models.Document }) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof createPostValidation>>({
        resolver: zodResolver(createPostValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags.join(',') : '',
        }
    })

    const { user } = useUserContext();
    const { mutateAsync: createPost, isPending: isLoadingCreater } = useCreatePost();
    const onCreatePost = async (post: z.infer<typeof createPostValidation>) => {
        const newPost = await createPost({
            ...post,
            userId: user?.id,
        });

        console.log(newPost);
        if (!newPost) {
            toast({ title: 'post not created' })
            return;
        }
        navigate('/')
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onCreatePost)}
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
                                {/* <Textarea className='shad-textarea curstom-scrollbar' {...field} /> */}
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
                <Button type="submit" >
                    {isLoadingCreater ? 'creating...' : 'submit'}
                </Button>
            </form>

        </Form>
    )
}

export default PostForm