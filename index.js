const express = require('express');
let port = 8080;
const app = express();
const path = require('path');
const fs = require('fs');
const Database = require('./config/mongoose');
const TableSchema = require('./model/schema');
const BlogSchema = require("./model/blogschema");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.use(express.urlencoded());
const multer = require('multer');
const file = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const imageuploads = multer({ storage: file }).single('image');
app.get('/', (req, res) => {
    return res.render('register');
})
app.get('/dashboard', (req, res) => {
    return res.render('dashboard');
})
app.get('/login', (req, res) => {
    return res.render('login');
})
app.get('/add', (req, res) => {
    return res.render('add');
})
app.post('/insertData', async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body;
        let Record = await TableSchema.create({
            name: name,
            email: email,
            password: password,
            cpassword: cpassword
        })
        if (password == cpassword) {
            if (Record) {
                console.log("Record Created");
                return res.redirect('/login');
            }
            else {
                console.log("Record Not Created");
                return false;
            }
        }
        else {
            console.log("Password and Confirm password are not Match");
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
})
app.post('/loginData', async (req, res) => {
    try {
        const { email, password } = req.body;
        let userLogin = await TableSchema.findOne({ email: email });
        if (!userLogin || userLogin.password != password) {
            console.log("Check your Password");
            return res.redirect('back');
        }
        console.log("User Login");
        return res.redirect('viewData');
    }
    catch (error) {
        console.log(error);
        return false;
    }
})
app.post('/blogData', imageuploads, async (req, res) => {
    try {
        const { title, description } = req.body;
        let image = '';
        if (req.file) {
            image = req.file.path;
        }
        console.log(image);
        let Record = await BlogSchema.create({
            title: title,
            description: description,
            image: image
        })
        if (Record) {
            console.log("record create");
            return res.redirect('back');
        }
        else {
            console.log("record not craete");
            return res.redirect('back');
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
})

app.get('/viewData', async (req, res) => {
    try {
        let Record = await BlogSchema.find({});
        if (Record) {
            return res.render('dashboard', {
                Record
            })
        }
        else {
            console.log("Record Not show");
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
})
app.get('/deleteData', async (req, res) => {
    try {
        let id = req.query.id;
        let oldRecord = await BlogSchema.findById(id);
        if (oldRecord) {
            fs.unlinkSync(oldRecord.image);
            let DeleteRecord = await BlogSchema.findByIdAndDelete(id);
            if (DeleteRecord) {
                console.log("Record Deleted");
                return res.redirect('back');
            }
            else {
                console.log("Record Not deleted");
                return false;
            }
        }
        else {
            console.log("File not Delete");
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
})
app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Done " + port);
    }
})