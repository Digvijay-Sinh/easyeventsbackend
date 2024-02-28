import Joi from 'joi';

 const userSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    isAuthenticated: Joi.boolean().required(),
    googleId: Joi.string().allow(null).optional(),
    password: Joi.string().required(),
    refreshToken: Joi.string().required()
}).options({
    allowUnknown:false
});

 const eventSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    location: Joi.string().required(),
    virtual: Joi.boolean().required(),
    offline: Joi.boolean().required(),
    freeEntry: Joi.boolean().required(),
    eventType: Joi.string().valid('CONFERENCE', 'WORKSHOP').required(),
    organizerID: Joi.number().integer().required()
}).options({
    allowUnknown:false
});

const eventIdSchema = Joi.object({
    id: Joi.number().integer().required()
});

const eventAll = Joi.object({
});

export const validationSchemas: { [key: string]: Joi.ObjectSchema } = {
    'POST:/api/v1/users': userSchema,
    'POST:/api/v1/events': eventSchema,
    'GET:/api/v1/events': eventAll

};
    

