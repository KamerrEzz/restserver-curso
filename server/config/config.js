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
    urldb = 'URL DE MONGODDB'
}
process.env.URLDB = urldb