import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    level: Number,
    hitpoints: Number,
    max_hitpoints: Number,
    temp_hitpoints: Number,
    classes: {
        type: {
            name: String,
            hitdiceValue: Number,
            classLevel: Number
        }
    },
    stats: {
        type: {
            strength: Number,
            dexterity: Number,
            constitution: Number,
            intelligence: Number,
            wisdom: Number,
            charisma: Number
        }
    },
    items: {
        type: {
            name: String,
            modifier: {
                affectedObject: String,
                affectedValue: String,
                value: Number
            }
        }
    },
    defenses: {
        type: {
            type: String,
            defense: String
        }
    },
    modification_notes: [ModificationNote]
});

export default mongoose.model('characters', schema);