// ==================
//        PUERTO
// ==================
process.env.PORT = process.env.PORT || 3000;

// ==================
//        PUERTO
// ==================
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

// ==================
//        CADUCIDAD
// ==================


// ==================
//        SEED
// ==================

process.env.SEED = process.env.SEED || 'mi-toke-dev'
// ==================
//        DB
// ==================
let urldb;
if(process.env.NODE_ENV === "dev"){
    urldb = 'mongodb://localhost:27017/coffe'
} else {
    urldb = process.env.MONG_URL
}
process.env.URLDB = urldb