import PostModel from '../models/Post.js'

export const getTags = async (req, res) => {
    try {
        const posts = await PostModel.find().exec();

        const tags = posts.map((obj) => obj.tags).flat()
        res.json(tags)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Qaytadan ko'rib chiqing."
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Qaytadan ko'rib chiqing."
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId
        });

        const post = await doc.save();
        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Post saqlanmadi.Qaytadan ko'rib chiqing."
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Qaytadan ko'rib chiqing."
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Post topilmadi."
                    })
                }

                res.json(doc)
            }
        ).populate('user')
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Qaytadan ko'rib chiqing."
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "O'chirish amalga oshmadi. Qaytadan urinib ko'ring."
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: "Post topilmadi."
                })
            }
            res.json({
                success: true,
            })
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Qaytadan ko'rib chiqing."
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                user: req.userId
            }
        )
        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Qaytadan ko'rib chiqing."
        })
    }
}