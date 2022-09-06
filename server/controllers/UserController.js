import jwt from'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(7);
        const hash = await bcrypt.hash(password, salt)
        const doc = new UserModel({
            email: req.body.email,
            fullname: req.body.fullname,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
    
        const user = await doc.save()
        const token = jwt.sign({
            _id: user._id,
        }, 
        'secret123',
        {
            expiresIn: '30d'
        });

        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Registratsiyada xatolik yuz berdi"
        })
    }
};

export const  login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: "Foydalanuvchi topilmadi"
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: "Parol yoki login xato."
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, 
        'secret123',
        {
            expiresIn: '30d'
        });

        const { passwordHash, ...userData } = user._doc
        res.json({
            ...userData,
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Avtorizatsiyada xatolik yuz berdi"
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Foydalanuvchi topilmadi."
            })
        }
        const { passwordHash, ...userData } = user._doc
        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ruxsat etilmagan."
        })
    }
}