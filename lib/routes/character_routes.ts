import { Application, Request, Response } from 'express';
import { CharacterController } from '../controllers/characterController';

export class CharacterRoutes {

    private character_controller: CharacterController = new CharacterController();

    public route(app: Application) {

        app.post('/api/character', (req: Request, res: Response) => {
            this.character_controller.create_character(req, res);
        });

        app.get('/api/character/:id', (req: Request, res: Response) => {
            this.character_controller.get_character(req, res);
        });

        app.put('/api/character/:id', (req: Request, res: Response) => {
            this.character_controller.update_character(req, res);
        });

        app.delete('/api/character/:id', (req: Request, res: Response) => {
            this.character_controller.delete_character(req, res);
        });
    }
}