import Joi from 'joi';

export const respondSchema = Joi.object({
    answers: Joi.object()
        .pattern(Joi.string().uuid(), Joi.string().uuid())
        .required()
});
