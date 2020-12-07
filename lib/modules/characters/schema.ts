import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    level: {
        type: Number,
        default: 1
    },
    hitpoints: Number,
    max_hitpoints: Number,
    temp_hitpoints: {
        type: Number,
        default: 0
    },
    classes: [{
        name: String,
        hitdiceValue: Number,
        classLevel: {
            type: Number,
            default: 1
        }
    }],
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
    items: [{
        name: String,
        modifier: {
            affectedObject: String,
            affectedValue: String,
            value: Number
        }
    }],
    defenses: [{
        damageType: String,
        defense: String
    }],
    modification_notes: [ModificationNote]
});

export default mongoose.model('characters', schema);