import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { ICharacter } from '../modules/characters/model';
import CharacterService from '../modules/characters/service';
import e = require('express');

export class CharacterController {

    private character_service: CharacterService = new CharacterService();

    public create_character(req: Request, res: Response) {
        //TODO: If I have time, this check feels like it needs to be done elsewhere
        //Just going to have the basics set on creating, items and defenses can be done on an update
        //Going to start all at level 1 for creations. Would use some kind of pairing for class name and hitdice value but not part of the requirement
        try {
            if (req.body.name === undefined) throw Error('Missing Name');
            if (req.body.stats.strength < 3) throw Error("Strength has to be greater than 3");
            if (req.body.stats.dexterity < 3) throw Error("dexterity has to be greater than 3");
            if (req.body.stats.constitution < 3) throw Error("constitution has to be greater than 3");
            if (req.body.stats.intelligence < 3) throw Error("intelligence has to be greater than 3");
            if (req.body.stats.wisdom < 3) throw Error("wisdom has to be greater than 3");
            if (req.body.stats.charisma < 3) throw Error("charisma has to be greater than 3");
            const character_params: ICharacter = {
                name: req.body.name,
                level: 1,
                max_hitpoints: 8,
                classes: [{
                    name: "cleric",
                    hitdiceValue: 8
                }],
                stats: {
                    strength: req.body.stats.strength,
                    dexterity: req.body.stats.dexterity,
                    constitution: req.body.stats.constitution,
                    intelligence: req.body.stats.intelligence,
                    wisdom: req.body.stats.wisdom,
                    charisma: req.body.stats.charisma
                },
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New character created'
                }]
            };

            this.character_service.createCharacter(character_params, (err: any, character_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('created character successfully', character_data, res);
                }
            });
        }
        catch (err) {
            insufficientParameters(err, res);
        }

    }

    public get_character(req: Request, res: Response) {
        if (req.params.id) {
            const user_filter = { _id: req.params.id };
            this.character_service.filterCharacter(user_filter, (err: any, user_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('get character successfully', user_data, res);
                }
            });
        } else {
            insufficientParameters("whoops", res);
        }
    }

    //I'm not a big fan of this. I would prefer just sending in one piece of data and it not updating the rest if they are not passed in
    //Not going to deal with this since this is just for testing purposes though
    //I also doubt this is how arrays would work on update lol
    public update_character(req: Request, res: Response) {
        if (req.params.id &&
            req.body.name ||
            req.body.level ||
            req.body.classes ||
            req.body.stats.strength || req.body.stats.dexterity || req.body.stats.constitution || req.body.stats.intelligence || req.body.stats.wisdom || req.body.stats.charisma ||
            req.body.items.name || req.body.items.modifier.affectedObject || req.body.items.modifier.affectedValue || req.body.items.modifier.value ||
            req.body.defenses.type || req.body.defenses.defense
        ) {
            const character_filter = { _id: req.params.id };
            this.character_service.filterCharacter(character_filter, (err: any, character_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                } else if (character_data) {
                    character_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'Character data updated'
                    });
                    const character_params: ICharacter = {
                        _id: req.params.id,
                        name: req.body.name ? req.body.name : character_data.name,
                        level: req.body.level ? req.body.level : character_data.level,
                        classes: req.body.classes ? req.body.classes : character_data.classes.push(),
                        stats: req.body.stats ? {
                            strength: req.body.stats.strength ? req.body.stats.strength : character_data.stats.strength,
                            dexterity: req.body.stats.dexterity ? req.body.stats.dexterity : character_data.stats.dexterity,
                            constitution: req.body.stats.constitution ? req.body.stats.constitution : character_data.stats.constitution,
                            intelligence: req.body.stats.intelligence ? req.body.stats.streintelligencegth : character_data.stats.intelligence,
                            wisdom: req.body.stats.wisdom ? req.body.stats.wisdom : character_data.stats.wisdom,
                            charisma: req.body.stats.charisma ? req.body.stats.charisma : character_data.stats.charisma
                        } : character_data.stats,
                        items: req.body.items ? req.body.items : character_data.items.push(),
                        defenses: req.body.defenses ? req.body.defenses : character_data.defenses.push(),
                        modification_notes: character_data.modification_notes
                    };
                    this.character_service.updateCharacter(character_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('updated character successfully', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid character', null, res);
                }
            });
        } else {
            insufficientParameters("whoops", res);
        }
    }

    public delete_character(req: Request, res: Response) {
        if (req.params.id) {
            this.character_service.deleteCharacter(req.params.id, (err: any, delete_details) => {
                if (err) {
                    mongoError(err, res);
                } else if (delete_details.deletedCount !== 0) {
                    successResponse('deleted character successfully', null, res);
                } else {
                    failureResponse('invalid character', null, res);
                }
            });
        } else {
            insufficientParameters("whoops", res);
        }
    }
}