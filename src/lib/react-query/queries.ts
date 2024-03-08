import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFollowing, createPost, createUserAccount, deletePost, deleteSavedPost, getAllUsers, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getSavedPosts, getUserById, getUsersPosts, googleSignUp, likePost, savePost, searchPosts, signInAccount, signOutAccount, unFollow, updatePost, updateUser } from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

const queryClient = new QueryClient();

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    });
};

export const useGoogleSignUp = () => {
    return useMutation({
        mutationFn: (user: { email: string; picture: URL; name: string; username: string }
        ) => googleSignUp(user),
    });
};


export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string, password: string }) =>
            signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            // Invalidate the 'getRecentPosts':
            // {i.e data of getRecentPosts is invalid and needs to be fetched again 
            // hence will not be reused further from cache and will be refetched }  
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    });
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            // invalidate/refetch the POST_BY_ID api by the id of post which is upadted 
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, { postId: data?.$id }]
            })
            // invalidate/refetch the GET_RECENT_POSTS api
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                exact: true,
                refetchType: 'active',
            });
            // invalidate/refetch the GET_POSTS api
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            // invalidate/refetch the GET_CURRENT_USER api
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (saveRecoredId: string) => deleteSavedPost(saveRecoredId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = () => {

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, { postId: data?.id }]
            })
        }
    })
};

export const useDeletePost = () => {


    return useMutation({
        mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }

    })
}

export const useGetInfinitePosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts as any,
        getNextPageParam: (lastPage: any) => {
            // If there's no data, there are no more pages.
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }
            // Use the $id of the last document as the cursor.
            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
    });
};

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}

export const useGetSavedPosts = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SAVED_POSTS, userId],
        queryFn: () => getSavedPosts(userId),
        enabled: !!userId
    })
}

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getAllUsers()
    })
}

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, { userId }],
        queryFn: () => getUserById(userId),
        enabled: !!userId
    })
}

export const useGetUsersPosts = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.USERS_POSTS, userId],
        queryFn: () => getUsersPosts(userId),
        enabled: !!userId
    })
}

export const useUpadteUser = () => {

    return useMutation({
        mutationFn: (post: IUpdateUser) => updateUser(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER, data]
            })
        }
    })
};

export const useAddFollowing = () => {
    return useMutation({
        mutationFn: (follow: { followerId: string; followingId: string }) => addFollowing(follow),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.follower?.$id],

            })
        }
    })
}

export const useUnFollow = (followerId: string) => {
    return useMutation({
        mutationFn: (followsId: string) => unFollow(followsId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, followerId]
            })
        }
    })
}