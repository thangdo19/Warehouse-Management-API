const express = require('express')
const router = express.Router()
const {Op} = require("sequelize");
const _ = require('lodash')
const sequelize = require('../db/connection')
const {Product, validateProduct, validateManagingProduct} = require(
    '../models/Product'
)
const {Category, validateCategory} = require('../models/Category')
const {Warehouse} = require('../models/Warehouse')
const {WarehouseProduct} = require('../models/WarehouseProduct')
const {UserWarehouse} = require('../models/UserWarehouse')
const {HistoryType} = require('../models/HistoryType')
const {History} = require('../models/History')
const {auth} = require('../middlewares/auth')
const client = require('../db/esConnection')
// const { checkAction } = require('../middlewares/check-action')
const pagination = require('../functions/pagination')

router.get('/', [auth], async (req, res) => {
    const itemCount = await Product.count()
    const options = pagination(req.query, itemCount)
    const products = await Product.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: {
            model: Warehouse,
            as: 'warehouses',
            attributes: [
                'id', 'cityId', 'name'
            ],
            through: {
                attributes: []
            }
        },
        include: {
          model: Category,
          as: 'category',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        },
        ...options
    })
    return res
        .status(200)
        .json({
            statusCode: 200,
            data: {
                products,
                ...options
            }
        })
}) //oke swagger

router.post('/insertProducts', async (req, res) => {
    const products = await Product.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'categoryId', 'note']
        }
    })
    console.log("asd", JSON.stringify(products))
    let bulkBody = [];

    products.forEach(item => {
        bulkBody.push({
            index: {
                _index: "products",
                _type: "_doc",
                _id: item.id
            }
        });

        bulkBody.push(item);
    });

    client.bulk({index: 'test', body: bulkBody})

    return res
        .status(200)
        .json({msg: 'Insert elasticsearch success'})

})
router.post('/updateEsProduct/:id', async (req, res) => {
    console.log('Dasd', req.params.id)
    client
        .update({
            index: "products",
            id: req.params.id,
            body: {
                doc: {
                    name: req.body.name
                }
            }
        })
        .then(function (resp) {
            console.log("Successful update! The response was: ", resp);
            return res
                .status(200)
                .json({msg: 'Update elasticsearch success'})
        }, function (err) {
            console.trace(err.message);
            return res
                .status(400)
                .json({msg: 'Update elasticsearch unsuccess'})
        });

})
router.post('/updateEsProduct/:id', async (req, res) => {
    console.log('Dasd', req.params.id)
    client
        .update({
            index: "products",
            id: req.params.id,
            body: {
                doc: {
                    name: req.body.name
                }
            }
        })
        .then(function (resp) {
            console.log("Successful update! The response was: ", resp);
            return res
                .status(200)
                .json({msg: 'Update elasticsearch success'})
        }, function (err) {
            console.trace(err.message);
            return res
                .status(400)
                .json({msg: 'Update elasticsearch unsuccess'})
        });

})

router.post('/deleteEsProduct/:id', async (req, res) => {
  await client.delete({
      index: "products",
      id: req.params.id
    });
    return res .status(200).json({
      msg: 'Update elasticsearch success'
    })
})
//search by Elasticsearch
router.get('/search/:productName', [auth],async (req,res)=>{
  let body = {
    size: 100,
    from: 0, 
    query: {      
      wildcard: {
          name: `*${req.params.productName.toLocaleLowerCase()}*`
      }
    }
  }
  var products = []
  await client.search({
    index:'products',  body:body
  }).then(results => {
    
    products = results.hits.hits.map(o=>({id:o._source.id,name:o._source.name}))
    console.log('o123',products)
    //console.log("oke2",results.hits.hits)
    console.log("oke",results.hits.hits[11]._source.name)
    return res
        .status(200)
        .json({
            statusCode: 200,
            data:{products:products},
            total:results.hits.hits.length
        })
  })
  .catch(err=>{
    console.log(err)
    return res
        .status(200)
        .json({
            statusCode: 200,
            data:{products:products},
            total:0
        })
  });
})

router.get('/categories',  [auth],async (req, res) => {
    const itemCount = await Category.count()
    const options = pagination(req.query, itemCount)
    const categories = await Category.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: {
            model: Product,
            as: 'products',
            attributes: {
                exclude: ['categoryId', 'createdAt', 'updatedAt']
            }
        },
        ...options
    })
    return res
        .status(200)
        .json({
            statusCode: 200,
            data: {
                categories,
                ...options
            }
        })
}) //oke swagger

// router.get('/search/:productName', async (req, res) => {
//     const itemCount = await Product.count()
//     const options = pagination(req.query, itemCount)
//     const products = await Product.findAll({
//         where: {
//             name: {
//                 [Op.like]: `%${req.params.productName}%`
//             }
//         },
//         attributes: ['id', 'name']
//     })
//     return res
//         .status(200)
//         .json({statusCode: 200, data: {
//                 products
//             }})
// }) //oke swagger

router.get('/:id',  [auth],async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: {
            model: Warehouse,
            as: 'warehouses',
            attributes: [
                'id', 'cityId', 'name'
            ],
            through: {
                attributes: []
            }
        },
        include: {
          model: Category,
          as: 'category',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        },
    })
    if (!product) 
        return res
            .status(404)
            .json(
                {statusCode: 404, message: `There is no product with id "${req.params.id}"`}
            )
    return res
        .status(200)
        .json({statusCode: 200, data: product})
}) //oke swagger

router.get('/categories/:id', [auth], async (req, res) => {
    const category = await Category.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: {
            model: Product,
            as: 'products',
            attributes: {
                exclude: ['categoryId', 'createdAt', 'updatedAt']
            }
        }
    })
    return res
        .status(200)
        .json({statusCode: 200, data: category})
}) //oke swagger
// get products by their warehouse
router.get('/warehouse/:id', [auth], async (req, res) => {
    const itemCount = await Product.count({
        include: {
            model: Warehouse,
            as: 'warehouses',
            where: {
                id: req.params.id
            }
        }
    })
    const options = pagination(req.query, itemCount)
    const warehouse = await Warehouse.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!warehouse) 
        return res
            .status(404)
            .json(
                {statusCode: 404, message: `There is no warehouse with id "${req.params.id}"`}
            )
    const products = await warehouse.getProducts({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        ...options
    })
    console.log(options)
    return res
        .status(200)
        .json({
            statusCode: 200,
            data: {
                products,
                ...options
            }
        })
})

router.get('/test', [auth], async (req, res) => {
    return res
        .status(200)
        .json({data: req.user})
})

/**
 * @Usage This route is used for 2 purposes:
 *        Create new product then import it into the specified warehouse.
 *        Handle import/export product of users.
 */
router.post('/', [
    auth, validateManagingProduct
], async (req, res) => {
    // authorization
    if (req.body.products.length > 0) {
        const userWarehouse = await UserWarehouse.findOne({
            where: {
                userId: req.user.id,
                warehouseId: req
                    .body
                    .products[0]
                    .warehouseId
            }
        })
        if (!userWarehouse) 
            return res
                .status(403)
                .json({statusCode: 403, message: 'User cannot access to this warehouse'})
        }
    // update product's stock when import/export from warehouse
    const transaction = await sequelize.transaction()
    try {
        for (const eachProduct of req.body.products) {
            const {warehouseId, actionType} = eachProduct
            const warehouse = await Warehouse.findOne({
                where: {
                    id: warehouseId
                }
            })
            if (!warehouse) 
                return res
                    .status(400)
                    .json({statusCode: 400, message: 'Invalid warehouse'})

            let product = await Product.findOne({
                where: {
                    name: eachProduct.name
                }
            })
            if (!product) {
                // if user want to export a product not exist, response
                if (actionType === 'EXPORT') 
                    return res
                        .status(400)
                        .json({statusCode: 400, message: 'Product not found. Cannot export'})
                const warehProd = await createNewProductAndAddRelationship(
                    eachProduct,
                    transaction,
                    warehouse
                )
                // create history, commit & response
                const history = await createWarehouseHistory(
                    actionType,
                    warehouse.id,
                    `${actionType} amount ${warehProd[0].stock}`
                )
                await createUserHistory(req, transaction, history, req.user.id)
            } else {
                // handle stock when import/export from warehouse
                const warehProd = await updateStock(
                    eachProduct.stock,
                    transaction,
                    warehouse,
                    product,
                    actionType
                )
                if (!warehProd) 
                    return res
                        .status(400)
                        .json({statusCode: 400, message: 'Not enough stock to export'})
                    // done, create history, commit transaction & response
                const history = await createWarehouseHistory(
                    actionType,
                    warehouse.id,
                    `${actionType} amount ${req.body.stock}`
                )
                await createUserHistory(req, transaction, history, req.user.id)
            }
        }

        await transaction.commit()
        return res
            .status(200)
            .json({statusCode: 200})
    } catch (error) {
        await transaction.rollback()
        console.log(error)
        return res
            .status(400)
            .json({statusCode: 400, message: error.message})
    }
}) //oke swagger

router.post('/categories', [
    auth, validateCategory
], async (req, res) => {
    try {
        const category = await Category.create(req.body)
        return res
            .status(201)
            .json({statusCode: 201, data: category})
    } catch (error) {
        return res
            .status(400)
            .json({statusCode: 400, message: error.message})
    }
}) //oke swagger


router.patch('/:id', [ auth,validateProduct], async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id }})
    if (!product) return res.status(404).json({ statusCode: 404, message: 'Product not found' })
    if (req.body.categoryId) {
        const category = await Category.findOne({ where: { id: req.body.categoryId }})
        if (!category) return res.status(404).json({ statusCode: 404, message: 'Category not found' })
    }    

    await Product.update(req.body, { where: { id: req.params.id } })
    return res.json({ status: 200 })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ statusCode: 500 })
  }
})

async function createWarehouseHistory(actionType, warehouseId, note) {
    const type = await HistoryType.findOne({
        where: {
            name: actionType
        }
    })
    return await History.create({typeId: type.id, warehouseId, note})
}

/**
 * @Usage This function create a new product with data from req param,
 * then create WarehouseProduct middle table between Product & Warehouse and
 * fill with stock prop
 * @param {*} product Request reference
 * @param {*} transaction Transaction reference
 * @param {*} warehouse Warehouse reference to add relation with
 */
async function createNewProductAndAddRelationship(
    newProduct,
    transaction,
    warehouse
) {
    try {
        // create product & add relationship to warehouse
        const product = await Product.create(newProduct, {transaction: transaction})
        const warehProd = await warehouse.addProduct(product.id, {
            transaction: transaction,
            through: {
                stock: newProduct.stock
            }
        })
        return warehProd
    } catch (error) {
        throw error
    }
}

/**
 * @Usage Find middle record between Warehouse & Product, if not
 * (product is in another warehouse but not this warehouse) => create one.
 * When it found. Update the stock when import/export from warehouse
 * @param {*} stock
 * @param {*} transaction
 * @param {*} warehouse
 * @param {*} product
 * @param {*} actionType
 */
async function updateStock(stock, transaction, warehouse, product, actionType) {
    stock = parseInt(stock, 10)
    try {
        // find relationship between warehouse & product
        let warehProd = await WarehouseProduct.findOne({
            where: {
                warehouseId: warehouse.id,
                productId: product.id
            }
        })
        // if warehouse not connected with product, add relationship here
        /** This is used when the system already have the product, but the current warehouse
    doesn't have this product */
        if (!warehProd) {
            warehProd = (
                await warehouse.addProduct(product.id, {transaction: transaction})
            )[0]
        }
        // update stock
        if (actionType === 'IMPORT') {
            console.log('result:', stock)
            warehProd = await warehProd.update({
                stock: warehProd.stock + stock
            }, {transaction: transaction})
        } else if (actionType == 'EXPORT') {
            if (warehProd.stock < stock) 
                return null
            warehProd = await warehProd.update({
                stock: warehProd.stock - stock
            }, {transaction: transaction})
        }

        return warehProd
    } catch (error) {
        throw error
    }
}

async function createUserHistory(req, transaction, history, userId) {
    try {
        const userHistory = await history.addUser(userId, {transaction: transaction})
    } catch (error) {
        throw error
    }
}

module.exports = router