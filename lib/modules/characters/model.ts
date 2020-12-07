import { ModificationNote } from "../common/model";

export interface ICharacter {
    _id?: String;
    name: String;
    level: number;
    hitpoints?: number;
    max_hitpoints?: number;
    temp_hitpoints?: number;
    classes?: Array<ICharacterClasses>;
    stats: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    items?: Array<ICharacterItems>;
    defenses?: Array<ICharacterDefenses>;
    modification_notes: ModificationNote[];
}

export interface ICharacterClasses {
    name?: String;
    hitdiceValue?: number;
    classLevel?: number;
}

export interface ICharacterItems {
    name: String;
    modifier: {
        affectedObject: String;
        affectedValue: String;
        value: number;
    };
}

export interface ICharacterDefenses {
    damageType: String;
    defense: String;
}