import User, { UserDocument } from '../models/UserModel';
import { DocumentDefinition } from "mongoose";
export async function createUser(input: DocumentDefinition<UserDocument>){
    try {
        return await User.create(input);
    } catch(error:any) {
        throw new Error(error);
    }
}

function findUser() {

}