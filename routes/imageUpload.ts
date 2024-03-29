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
       const fileTypes = /jpeg|jpg|png|gif|jfif/
       const mimeTypes = fileTypes.test(file.mimetype)
       const extname = fileTypes.test(path.extname(file.originalname))

       if(mimeTypes && extname){
           return cb(null , true)
       }
      
    }
    })
    router.post('/upload', upload.single('image'), (req, res) => {
        try {

            console.log(req.file);
            
            // Check if file is present in the request
            if (!req.file) {
                throw new Error('No file uploaded');
            }
    
            // Handle the uploaded file here
            const file = req.file;
            // Do something with the file, such as saving it to a database or processing it further
            
            // Assuming file.filename contains the filename of the uploaded file
            const filename = file.filename;
            
            // If you want to send the filename as a response
            res.json({ data: filename });
            
            // If you want to send the URL of the uploaded image as a response
            // const imageUrl = `http://yourdomain.com/uploads/${filename}`;
            // res.json({ imageUrl });
        } catch (error : any) {
            console.error('Error:', error.message);
            res.status(500).json({ error: error.message }); // Send error response
        }
    });

export default router;
