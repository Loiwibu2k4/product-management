const express = require('express');
const router = express.Router(); 

const multer = require('multer');
const upload = multer(); //{ storage : storageMulter(multer) }

const validate = require('../../validates/admin/product.validate');

const controller = require("../../controllers/admin/product.controller");

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete-item/:delete_status/:id", controller.deleteItem);

router.get("/create", controller.create);



router.post(
    "/create",
    upload.single('thumbnail'),
    uploadCloud.uploadCloud,
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.uploadCloud,
    validate.createPost,
    controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.post(
    '/upload',
    upload.single('file'),
    uploadCloud.uploadImageCloud
);
  

module.exports = router;
  