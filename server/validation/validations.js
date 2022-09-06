import { body } from 'express-validator';

export const loginValidation = [
    body('email', "Email notog'ri formatda kiritildi.").isEmail(),
    body('password', "Parolda kamida 5 ta simvol bo'lishi kerak.").isLength({ min: 5 }),
]

export const registerValidation = [
    body('email', "Email notog'ri formatda kiritildi.").isEmail(),
    body('password', "Parolda kamida 5 ta simvol bo'lishi kerak.").isLength({ min: 5 }),
    body('fullname', "Ismni kiriting.").isLength({ min: 3 }),
    body('avatarUrl', "Noto'g'ri url manzil ko'rsatilgan.").optional().isURL(),
]

export const postCreateValidation = [
    body('title', "Post nomi to'g'ri kiriting.").isLength({ min: 3}).isString(),
    body('text', "Post textnini to'g'ri kiriting.").isLength({ min: 10 }).isString(),
    body('tags', "Post tegini to'g'ri kiriting.").optional().isString(),
    body('imageUrl', "Noto'g'ri url manzil ko'rsatilgan.").optional().isString(),
]