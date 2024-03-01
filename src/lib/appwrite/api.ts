import { INewUser } from "@/types";
import { account } from "./config";
import { ID } from "appwrite";

export async function createUserAccount({
    name,
    email,
    password
}: INewUser) {
    try {
        const newAccont = await account.create(
            ID.unique(),
            email,
            password,
            name,
        );
        
        return newAccont;
    } catch (er: any) {
        console.log(er);
        return er


    }

} 