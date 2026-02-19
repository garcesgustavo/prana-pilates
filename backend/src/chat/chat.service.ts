import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
    private openai: OpenAI;
    private readonly logger = new Logger(ChatService.name);

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async getResponse(message: string): Promise<{ reply: string }> {
        try {
            if (!process.env.OPENAI_API_KEY) {
                this.logger.warn('OPENAI_API_KEY is not set. Returning mock response.');
                return {
                    reply: 'Lo siento, no puedo procesar tu solicitud en este momento. Por favor verifica la configuración del sistema.',
                };
            }

            const completion = await this.openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Eres un asistente inteligente experto en Pilates para el estudio "Prana Pilates". 
            Responde de manera amable, profesional y motivadora. 
            Tus conocimientos incluyen:
            - Beneficios del Pilates (flexibilidad, fuerza, postura, reducción de estrés).
            - Diferencias entre Pilates Mat y Reformer.
            - Horarios y clases (puedes inventar horarios genéricos o pedir consultar la web si no tienes datos específicos).
            - Recomendaciones para principiantes.
            
            Si te preguntan algo fuera de este contexto, responde educadamente que solo puedes ayudar con temas relacionados con Pilates y el estudio.
            `,
                    },
                    { role: 'user', content: message },
                ],
                model: 'gpt-3.5-turbo',
            });

            return {
                reply: completion.choices[0].message.content || 'Lo siento, no pude generar una respuesta.',
            };
        } catch (error) {
            this.logger.error('Error connecting to OpenAI:', error);
            return {
                reply: 'Hubo un error al conectar con el asistente. Por favor intenta más tarde.',
            };
        }
    }
}
