const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search") 
const paginationHelper = require("../../helpers/pagination");

const systemConfig = require("../../config/system");

// [GET] /admin/products
    module.exports.index = async (req, res) => {

        // button isActive
        const filterStatus = filterStatusHelper(req.query);

        // query criteria
        let find = {
            // deleted : false
        };

        // search object
        let objectSearch = {};
        console.log(req);
        objectSearch = searchHelper(req.query);
        find = {...find, ...objectSearch};

        // variables
        const keyword = req.query.keyword; 

        // add parameter into query criteria 
        if(req.query.status){
            find.status = req.query.status;
        }

        // checkbox
        let listIdChangeStatus = "";
        if(req.query.list_id_change_status) listIdChangeStatus = req.query.list_id_change_status;

        // pagination
        const countProducts = await Product.countDocuments(find);
        let objectPagination = {
            limititems : 4,
            currentPage: 1
        };
        objectPagination = paginationHelper(req.query, objectPagination, countProducts);
        
// SET SLUG
        // let productss = await Product.find({});
        // productss.forEach( product => {
        //     product.slug = product.title.toLowerCase().replace(/[^a-z0-9-]/g, '-') + '-' + product.brand.toLowerCase().replace(/[^a-z0-9-]/g, '-'); // Example slug generation
        //     product.save();
        // })

        //sort criteria
        let sortObject = {};
        if(req.query.sortCriteria) {
            const [sortkey, sortCriteria] = req.query.sortCriteria.split("-");
            sortObject[sortkey] = sortCriteria;
        }
        // Dig into database by model and render pug file
        const products = await Product.find(find)
            .sort(
                sortObject
            )
            .limit(objectPagination.limititems)
            .skip(objectPagination.skip);
        
        res.render(`admin/pages/products/index`, {
            pageTitle : "Product Admin",
            products : products,
            filterStatus : filterStatus,
            keyword : keyword,
            objectPag : objectPagination,
            listIdChangeStatus : listIdChangeStatus,
        });
    };





// [PATCH] /admin/products/change-status/:status/:id
    module.exports.changeStatus = async (req, res) => {
        const status = req.params.status;
        const id = req.params.id;
        try {
        // Update the product
            await Product.findOneAndUpdate(
                { _id: id },
                { $set: { status: status} }
            );
            req.flash('success', `Update status to ${status} for 1 product`);
        } catch (error) {
            console.error(error);
            req.flash('error', `cannot Update status to ${status} for 1 product`);
            res.status(500).send('Internal Server Error');
        }
        console.log(req.flash());
        res.redirect("back");
    }






// [PATCH] /admin/products/change-multi
    module.exports.changeMulti = async (req, res) => {
        
        const stringId = req.body.ids
        const status = req.body.type;
        const objectStatus = {};
        let timeNow = new Date();
        timeNow.setTime(timeNow.getTime());
        let ids = stringId.split(' - ');ids.pop();        
        
        try {
            for(let item of ids) {
                let [id, position] = item.split('.');
                position = parseInt(position);
                await Product.findOneAndUpdate(
                    { _id: id },
                    { $set: { position: position} }
                );
                ids.splice(ids.indexOf(item), 1, item.substring(0, item.indexOf('.')));
            };
        } catch (error) {
            console.error(error);
            res.redirect("back");
        }

        
        switch (status) {
            case "delete":
                objectStatus["deleted"] = true;
                objectStatus["changeDeleteStatus"] = timeNow
                break;
            case "restore":
                objectStatus["deleted"] = false;
                objectStatus["changeDeleteStatus"] = timeNow
                break;
            case 'active':
                objectStatus["status"] = "active";
                break;
            case 'inactive':
                objectStatus["status"] = "inactive";
                break;
            case 'hard-delete':
                try {
                    await Product.deleteMany({ _id: { $in: ids } });
                } catch (error) {
                    console.error('Error deleting documents:', err);
                }
                break;
            default:
                break;
        }
        try {
            await Product.updateMany(
                { _id: { $in: ids } },
                { $set: objectStatus }
            );
            req.flash('success', `Update status to ${status} for ${ids.length} products`);
            res.redirect("back");
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
            req.flash('error', `Update status to ${status} for ${ids.length} products failed`);
            res.redirect("back");
        }
    }




// [DELETE] /admin/products/delete-item/:delete-status/:id
    module.exports.deleteItem = async (req, res) => {
        const id = req.params.id;
        const isDelete = req.params.delete_status === "true" ? true : false;
        try {
            await Product.updateOne(
                { _id: id },
                { $set: {
                    deleted : isDelete,
                    changeDeleteStatus: new Date(),
                    // deletedBy: {
                    //     user_id: req.locals.user.id,
                    //     deletedAt: new Date()
                    // },
                } }
            );
            req.flash('success', `Update status to ${isDelete ? "Delete" : "Restore"} for 1 product`);
            res.redirect("back");    
        } catch (error) {
            console.error(error);
            // res.status(500).send('Internal Server Error');
            req.flash('error', `cannot Update status to ${isDelete ? "Delete" : "Restore"} for 1 product`);
            res.redirect("back");
        }
        // res.send("OK");
    };



// [GET] /admin/products/create
    module.exports.create = async (req, res) => {
        res.render(`admin/pages/products/create`, {
            pageTitle: "Create New Product"
        })
    };



// [POST] /admin/products/create
    async function findMaxPosition() {
        const result = await Product.findOne().sort('-position').exec();
        return result ? result.position : 0;
    }
    module.exports.createPost = async (req, res) => {
        try {
            const object = {};
            // if no send position
            if(!req.body.position) {
                const newPosition = await findMaxPosition() + 1;
                req.body.position = newPosition;
            }
            
            req.body.createdBy = {
                user_id: res.locals.user.id
            };
            
            const newProduct = new Product(req.body);
            await newProduct.save();


            req.flash("success", "create product success");
            res.render("admin/pages/products/success");
        } catch (error) {
            console.error(err);
            req.flash("error", "cannot create product");
            res.redirect("back");
        }
    };






// [GET] /admin/products/edit/:id
    module.exports.edit = async (req, res) => {
        try {
            const [product] = await Product.find({
                _id : req.params.id
            });
            
            res.render(`admin/pages/products/edit`, {
                pageTitle: "Edit Product",
                product: product
            })
        } catch (error) {
            req.flash("error", "Can't find Product");
            res.redirect(`${systemConfig.prefixAdmin}/products`);
        }
    }

// [PATCH] /admin/products/edit/:id
    module.exports.editPatch = async (req, res) => {

        let productEdit = req.body;

        const id = req.params.id;

        let product = await Product.find({
            _id: id
        })

        // if send file
        product = {...product, ...productEdit};

        try {
            await Product.updateOne(
                { _id:  id},
                { $set: product }
            )
            req.flash("success", "update product success");
            res.redirect("back");
        } catch (error) {
            req.flash("error", "Cannot update product");
            console.error("err");
            res.redirect("back");
        }
    };

// [GET] admin/products/detail/:id
    module.exports.detail = async (req, res) => {
        const id = req.params.id;
        const [product] = await Product.find({
            _id: id
        })
        res.render("admin/pages/products/detail",  {
            pageTitle: "Product Details",
            product: product
        });
    }