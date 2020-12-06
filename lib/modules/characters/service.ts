import { ICharacter } from './model';
import characters from './schema';

export default class CharacterService {

    public createCharacter(character_params: ICharacter, callback: any) {
        const _session = new characters(character_params);
        _session.save(callback);
    }

    public filterCharacter(query: any, callback: any) {
        characters.findOne(query, callback);
    }

    public updateCharacter(character_params: ICharacter, callback: any) {
        const query = { _id: character_params._id };
        characters.findOneAndUpdate(query, character_params, callback);
    }

    public deleteCharacter(_id: String, callback: any) {
        const query = { _id: _id };
        characters.deleteOne(query, callback);
    }
}