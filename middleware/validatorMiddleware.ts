import { NextFunction, Request, Response } from 'express';
import { validationSchemas } from '../validator/schemas/schema';


export default function validateRequest(req: Request, res: Response, next: NextFunction) {
    const route = req.url?.split('?')[0]; // Extracting route from URL
    const method = req.method;
    const key = `${method}:${route}`;

    if (method==='GET') {
        next()
    }
   
    const schema = validationSchemas[key];

    console.log('========req.params================');
    console.log(req.params);
    console.log('========req.params=================');
  
    if (!schema) {
        res.status(400).json({"msg":"No validation found with this request"})
        return ;
    }

 

    const queryParams = req.query;
    const extraQueryParams = Object.keys(queryParams).length;
    if (extraQueryParams>0) {
        return res.status(400).json({ error: "Extra parameters in query not allowed" });

    }



    console.log('Validation Schema:', schema.describe());
    console.log('request body:', req.body);

    const { error, value } = schema.validate(req.body);

    console.log('Validation Error:', error);
    console.log('Validated Value:', value);
    if (error) {
        const errorMessage = error.details ? error.details[0].message : 'Validation error';
        return res.status(400).json({ error: errorMessage });
    
     }
    next();
}