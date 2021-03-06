import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { ICharacter } from '../modules/characters/model';
import CharacterService from '../modules/characters/service';
import e = require('express');

export class CharacterController {

    private character_service: CharacterService = new CharacterService();
    public create_character(req: Request, res: Response) {
        if (req.body.name && req.body.level > 0 && req.body.stats
            && req.body.stats.strength >= 3 && req.body.stats.strength <= 20
            && req.body.stats.dexterity >= 3 && req.body.stats.dexterity <= 20
            && req.body.stats.intelligence >= 3 && req.body.stats.intelligence <= 20
            && req.body.stats.constitution >= 3 && req.body.stats.constitution <= 20
            && req.body.stats.wisdom >= 3 && req.body.stats.wisdom <= 20
            && req.body.stats.charisma >= 3 && req.body.stats.charisma <= 20
            && req.body.classes && req.body.items && req.body.defenses) {

            const character_params: ICharacter = {
                name: req.body.name,
                level: req.body.level,
                classes: req.body.classes,
                stats: {
                    strength: req.body.stats.strength,
                    dexterity: req.body.stats.dexterity,
                    constitution: req.body.stats.constitution,
                    intelligence: req.body.stats.intelligence,
                    wisdom: req.body.stats.wisdom,
                    charisma: req.body.stats.charisma
                },
                items: req.body.items,
                defenses: req.body.defenses,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New Character created'
                }]
            };

            //calculating the average hitpoints by giving the first level the max hitdice and each additional level the average (can't remember if this works for the 2nd multiclass but that's what I am going with)
            var hitpoints = 0;
            character_params.classes.forEach(element => {
                if (element.classLevel > 1) {
                    hitpoints = hitpoints + (element.classLevel * element.hitdiceValue) - (((element.classLevel - 1) * element.hitdiceValue) / 2)
                }
                else {
                    hitpoints = hitpoints + element.hitdiceValue;
                }
            });

            //Getting the total constitution score by grabbing it from the stat itself and then checking for any item enhancements
            //I do think that this won't stack though according to the D&D rules, but I'm not going to take that into account here for simplicity
            var totalConstitutionScore = character_params.stats.constitution;
            if (character_params.items) {
                character_params.items.forEach(element => {
                    if (element.modifier.affectedValue === "constitution") {
                        totalConstitutionScore = totalConstitutionScore + element.modifier.value;
                    }
                });
            }

            //Adding the bonus hitpoints for each level with the constitution modfifier
            var bonusHitPoints = Math.floor((totalConstitutionScore - 10) / 2) * character_params.level;

            character_params.hitpoints = hitpoints + bonusHitPoints;
            character_params.max_hitpoints = hitpoints + bonusHitPoints;

            this.character_service.createCharacter(character_params, (err: any, character_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('created character successfully', character_data, res);
                }
            });
        }
        else {
            insufficientParameters("Missing or Invalid parameters", res);
        }
    }

    public get_character(req: Request, res: Response) {
        if (req.params.id) {
            const character_filter = { _id: req.params.id };
            this.character_service.filterCharacter(character_filter, (err: any, character_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('get character successfully', character_data, res);
                }
            });
        } else {
            insufficientParameters("whoops", res);
        }
    }

    public add_temp_hp(req: Request, res: Response) {
        if (req.params.id && req.body.temp_hitpoints && req.body.temp_hitpoints > 0) {
            const character_filter = { _id: req.params.id };
            this.character_service.filterCharacter(character_filter, (err: any, character_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                }
                else if (character_data) {
                    character_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'Character added temporary hitpoints'
                    });
                    const character_params: ICharacter = {
                        _id: req.params.id,
                        name: character_data.name,
                        level: character_data.level,
                        temp_hitpoints: req.body.temp_hitpoints ? req.body.temp_hitpoints : character_data.temp_hitpoints,
                        stats: character_data.stats,
                        modification_notes: character_data.modification_notes
                    };
                    this.character_service.updateCharacter(character_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        }
                        else {
                            successResponse('add temporary hitpoints successfully', null, res);
                        }
                    })
                }
                else {
                    failureResponse('invalid character', null, res);
                }
            })
        }
        else {
            insufficientParameters("Missing or Invalid parameters", res);
        }
    }

    public heal(req: Request, res: Response) {
        if (req.params.id && req.body.heal && req.body.heal > 0) {
            const character_filter = { _id: req.params.id };
            this.character_service.filterCharacter(character_filter, (err: any, character_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                }
                else if (character_data && character_data.hitpoints < character_data.max_hitpoints) {
                    character_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'Character healed'
                    });
                    var newHitPoints = character_data.hitpoints;

                    //heal all the hitpoints but check to not go over the max, ignore temp hit points since they can't be healed
                    if (req.body.heal + character_data.hitpoints <= character_data.max_hitpoints) {
                        newHitPoints = character_data.hitpoints + req.body.heal;
                    }
                    else {
                        newHitPoints = character_data.max_hitpoints;
                    }
                    const character_params: ICharacter = {
                        _id: req.params.id,
                        name: character_data.name,
                        level: character_data.level,
                        hitpoints: newHitPoints,
                        stats: character_data.stats,
                        modification_notes: character_data.modification_notes
                    };
                    this.character_service.updateCharacter(character_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        }
                        else {
                            successResponse('healed character successfully', null, res);
                        }
                    })
                }
                else {
                    failureResponse('invalid character', null, res);
                }
            })
        }
        else {
            insufficientParameters("Missing or invalid parameters", res);
        }
    }

    public damage(req: Request, res: Response) {
        if (req.params.id && req.body.damage && req.body.damage > 0 && req.body.damageType) {
            const character_filter = { _id: req.params.id };
            req.body.damage = req.body.damage as Number;
            this.character_service.filterCharacter(character_filter, (err: any, character_data: ICharacter) => {
                if (err) {
                    mongoError(err, res);
                }
                else if (character_data) {
                    character_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'Character damaged'
                    });

                    var tempHitPoints = character_data.temp_hitpoints;
                    var damage = req.body.damage;
                    var newHitPoints = character_data.hitpoints;

                    //check for damage type, immunity means no damage moving forward, resistance means half total damage
                    character_data.defenses.forEach(element => {
                        if (element.damageType === req.body.damageType) {
                            if (element.defense === "immunity") {
                                damage = 0;
                            }
                            else if (element.defense == "resistance") {
                                damage = Math.ceil(req.body.damage / 2);
                            }
                        }
                    });

                    //if there are any hit points, remove them first
                    //then if tempHitPoints is less than zero, if we flip that to positive that's how much damage is left to heal out normally
                    if (tempHitPoints > 0 && damage != 0) {
                        tempHitPoints = tempHitPoints - damage;
                        if (tempHitPoints < 0) {
                            damage = Math.abs(tempHitPoints);
                            tempHitPoints = 0;
                        }
                    }

                    //remove damage from any remaining hitpoints after everything else has been calculated
                    if (damage > 0) {
                        newHitPoints = newHitPoints - damage;
                    }

                    const character_params: ICharacter = {
                        _id: req.params.id,
                        name: character_data.name,
                        level: character_data.level,
                        temp_hitpoints: tempHitPoints,
                        hitpoints: newHitPoints,
                        stats: character_data.stats,
                        modification_notes: character_data.modification_notes
                    };
                    this.character_service.updateCharacter(character_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        }
                        else {
                            successResponse('damaged character successfully', null, res);
                        }
                    })
                }
                else {
                    failureResponse('invalid character', null, res);
                }
            })
        }
        else {
            insufficientParameters("Missing or invalid parameters", res);
        }
    }

    //Ignore basically everything underneath here. I ran out of time on playing with this and it's not finished.

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
            this.character_service.deleteCharacter(req.params.id, (err: any, delete_details: { deletedCount: number; }) => {
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