import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "ap-northeast-2",
    credentials : {
        apiVersion: "2023-03-24",
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    },
});

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: 'wetube-jehwan',
    acl: 'public-read',
    key(req, file, cb) {
        cb(null, `images/${Date.now()}_${file.originalname}`);
    },
});

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: 'wetube-jehwan',
    acl: 'public-read',
    key(req, file, cb) {
        cb(null, `videos/${Date.now()}_${file.originalname}`);
    },
});

const isHeroku = process.env.NODE_ENV === "production";


export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "WeTube";
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        req.flash("error", "Log in first.");
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
};

export const avatarUpload = multer({
    dest: "uploads/avatars/", 
    limits: { 
        fileSize: "3000000"
    },
    storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: { 
        fileSize: "10000000"
    },
    storage: isHeroku ? s3VideoUploader : undefined,
});