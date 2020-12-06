import { ICharacter } from './model';
import characters from './schema';

export default class UserService {

    public createUser(user_params: ICharacter, callback: any) {
        const _session = new characters(user_params);
        _session.save(callback);
    }

    public filterUser(query: any, callback: any) {
        characters.findOne(query, callback);
    }

    public updateUser(user_params: ICharacter, callback: any) {
        const query = { _id: user_params._id };
        characters.findOneAndUpdate(query, user_params, callback);
    }

    public deleteUser(_id: String, callback: any) {
        const query = { _id: _id };
        characters.deleteOne(query, callback);
    }
}