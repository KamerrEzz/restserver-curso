// ==================
//        PUERTO
// ==================
process.env.PORT = process.env.PORT || 3000;

// ==================
//        PUERTO
// ==================
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

// ==================
//        DB
// ==================
let urldb;
if(process.env.NODE_ENV === "dev"){
    urldb = 'mongodb://localhost:27017/coffe'
} else {
    urldb = 'mongodb+srv://kmradd:Irt6EwKjYCA3M7Pk@cluster0-k2k0d.mongodb.net/coffe'
}
process.env.URLDB = urldb