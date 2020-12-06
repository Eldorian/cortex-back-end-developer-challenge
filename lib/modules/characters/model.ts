import { ModificationNote } from "../common/model";

export interface ICharacter {
    _id?: String;
    name: String;
    level: Number;
    hitpoints: Number;
    max_hitpoints: Number;
    temp_hitpoints: Number;
    classes: {
        name: String;
        hitdiceValue: Number;
        classLevel: Number;
    };
    stats: {
        strength: Number;
        dexterity: Number;
        constitution: Number;
        intelligence: Number;
        wisdom: Number;
        charisma: Number;
    };
    items: {
        name: String;
        modidier: {
            affectedObject: String;
            affectedValue: String;
            value: Number;
        };
    };
    defenses: {
        type: String;
        defense: String;
    };
    modification_notes: ModificationNote[];
}