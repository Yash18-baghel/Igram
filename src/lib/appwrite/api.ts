import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";
// SIGN UP
export async function createUserAccount({
    email,
    password,
    name,
    username
}: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function googleSignUp({
    email,
    picture,
    name,
    username
}: { email: string; picture: URL; name: string; username: string }) {
    try {
        const password = email;
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newAccount) throw Error;

        if (!picture) {

            picture = avatars.getInitials(name);
        }

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: username,
            imageUrl: picture,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// SAVE USER TO DB
export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: { email: string, password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (er) {
        console.log(er);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (er) {
        console.log(er);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}

export async function createPost({
    userId,
    caption,
    file,
    location,
    tags
}: INewPost) {
    try {
        // upload image to storage
        const uploadedFile = await uploadfile(file[0]);
        if (!uploadedFile) throw Error;

        // get file url
        const fileUrl = getPreviewUrl(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags into array
        const Tags = tags?.replace(/ /g, "").split(",") || [];

        // save the post to DB
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: userId,
                caption,
                imageUrl: fileUrl,
                imageId: uploadedFile?.$id,
                location,
                tags: Tags
            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
        console.log(error);
    }

}

export const getRecentPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(20)]
        )

        if (!posts) throw Error;

        return posts;
    }
    catch (er) {
        console.log(er);
    }
}
export const uploadfile = async (file: File) => {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadedFile;
    } catch (err) {
        console.log(err);
    }
}


export const getPreviewUrl = (fileId: string) => {

    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000, // width
            2000, // height
            "top", // gravity
            100 // quality (100%)
        );
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch (err) {
        console.log(err);
    }
};


export const deleteFile = async (fileId: string) => {

    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId,
        );

        return { status: 'ok' };
    } catch (err) {
        console.log(err);
    }

};

export const likePost = async (postId: string, likesArray: string[]) => {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        );
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (err) {
        console.log(err);
    }
}

export const savePost = async (postId: string, userId: string) => {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        );
        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (err) {
        console.log(err);
    }
}

export const deleteSavedPost = async (saveId: string) => {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            saveId
        );
        if (!statusCode) throw Error;

        return { status: 'ok' };
    } catch (err) {
        console.log(err);
    }
}

export const getPostById = async (postId: string) => {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );

        if (!post) throw Error;

        return post;
    } catch (err) {
        console.log(err);
    }

}


export async function updatePost({
    postId,
    caption,
    imageId,
    imageUrl,
    file,
    location,
    tags
}: IUpdatePost) {
    const hasFileToUpdate = file.length > 0;
    try {
        let image = {
            imageId,
            imageUrl
        };

        if (hasFileToUpdate) {
            // upload image to storage
            const uploadedFile = await uploadfile(file[0]);
            if (!uploadedFile) throw Error;

            // get file url
            const fileUrl = getPreviewUrl(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = {
                ...image,
                imageId: uploadedFile.$id,
                imageUrl: fileUrl
            }
        }

        // Convert tags into array
        const Tags = tags?.replace(/ /g, "").split(",") || [];

        // update post
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                caption,
                location,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                tags: Tags
            }
        );

        // Failed to update
        if (!updatedPost) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }

            // If no new file uploaded, just throw error
            throw Error;
        }

        // Safely delete old file after successful update
        if (hasFileToUpdate) {
            await deleteFile(imageId);
        }

        return updatedPost;
    } catch (error) {
        console.log(error);
    }

}

export const deletePost = async (postId: string, imageId: string) => {
    if (!postId || !imageId) throw Error

    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
        );

        if (!statusCode) throw Error;

        await deleteFile(imageId);

        return { status: 'ok' };
    } catch (er) {
        console.log(er);
    }

}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );

        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export const searchPosts = async (searchTerm: string) => {

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search("caption", searchTerm)]
        )

        if (!posts) throw Error;
        return posts;
    } catch (err) {
        console.log(err);
    }
}

export const getSavedPosts = async (userId: string) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.equal("user", userId)]
        );

        if (!posts) throw Error;

        return posts;
    }
    catch (er) {
        console.log(er);
    }
}

export async function getAllUsers() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.orderDesc('$createdAt'), Query.notEqual('accountId', currentAccount.$id)]
        );

        if (!users) throw Error;

        return users;

    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
        const users = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );

        if (!users) throw Error;

        return users;

    } catch (error) {
        console.log(error);
    }
}

export const getUsersPosts = async (userId: string) => {
    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.equal('creator', userId)]
        );

        if (!post) throw Error;
        return post;
    } catch (err) {
        console.log(err);
    }

}

export async function updateUser({
    userId,
    imageId,
    file,
    name,
    email,
    username,
    bio
}: IUpdateUser) {
    try {

        // upload image to storage
        const uploadedFile = await uploadfile(file[0]);
        if (!uploadedFile) throw Error;

        // get file url
        const fileUrl = getPreviewUrl(uploadedFile.$id);
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        await deleteFile(imageId);

        // update user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            {
                name,
                email,
                username,
                bio,
                imageUrl: fileUrl,
                imageId: uploadedFile?.$id,
            }
        );

        if (!updatedUser) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return updatedUser
    } catch (error) {
        console.log(error);
    }
}
