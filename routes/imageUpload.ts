import express from "express";
import multer from 'multer';
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})
const upload = multer({
    storage: storage,
    limits:{fileSize : 10000000},
    fileFilter:(req , file,cb)=>{
       const fileTypes = /jpeg|jpg|png|gif/
       const mimeTypes = fileTypes.test(file.mimetype)
       const extname = fileTypes.test(path.extname(file.originalname))

       if(mimeTypes && extname){
           return cb(null , true)
       }
      
    }
    })
router.post('/upload', upload.single('image'), (req, res) => {
    // Handle the uploaded file here
    const file = req.file;
    // Do something with the file, such as saving it to a database or processing it further
    res.send('File uploaded successfully');
});


export default router;
