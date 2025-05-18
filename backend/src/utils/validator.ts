import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for(let validation of validations) {
            const result = await validation.run(req);
            if(!result.isEmpty())
                break;
        }
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            return next();
        }
        res.status(422).json({errors: errors.array()})
    }
}

export const signupValidator = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email address')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    
];


export const loginValidator = [
   
    body('email')
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email address')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
];


export const chatCompletionValidator = [
    body('message')
        .isString()
        .withMessage('Message is required')
        .notEmpty()
        
    
];
