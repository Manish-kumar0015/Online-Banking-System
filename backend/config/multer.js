const multer = require("multer");

const path = require("path");

// ======================================
// Configure Multer Storage
// Stores uploaded profile images
// inside the uploads/profile folder
// ======================================

const storage = multer.diskStorage({

    // Define destination folder
    // where profile images will be saved
    destination: (req,file,cb)=>{

        cb(null,"uploads/profile");

    },

    // Generate a unique filename
    // using current timestamp while
    // preserving the original extension
    filename:(req,file,cb)=>{

        const uniqueName=

            Date.now()+

            path.extname(file.originalname);

        cb(null,uniqueName);

    }

});

// ======================================
// Initialize Multer middleware
// using the configured storage
// ======================================

const upload = multer({

    storage

});

// Export upload middleware
// to be used in upload routes

module.exports = upload;