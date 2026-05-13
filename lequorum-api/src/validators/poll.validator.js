import Joi from 'joi';

export const pollSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    isAnonymous: Joi.boolean().required(),
    expiresAt: Joi.date().greater('now').required(),
    questions: Joi.array().items(
        Joi.object({
            text: Joi.string().required(),
            isMandatory: Joi.boolean().required(),
            options: Joi.array()
                .items(Joi.object({ text: Joi.string().required() }))
                .min(2)
                .required()
        })
    ).min(1).required()
});
