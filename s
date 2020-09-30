try {
  const warehouse = await Warehouse.findOne({ where: { id: warehouseId }})
  let product = await Product.findOne({ where: { name: req.body.name } })

  if (product) {
    if (actionType === 'IMPORT') {
      // Sum the stock of product with 
      await product.update({ stock: product.stock + req.body.stock }, { 
        transaction: transaction 
      })
    }
    // actionType == 'EXPORT'
    else { 
      // Update stock of the product, if stock not enough to export,
      // sequelize will throw an exception for us
      try {
        await product.update({ stock: product.stock - req.body.stock }, { 
          transaction: transaction 
        })
      } catch (error) {
        return res.json({ statusCode: 400, message: 'Not enough stock to export' })
      }
    }
  }
  // no product found in the warehouse
  else {
    if (actionType === 'EXPORT') {
      return res.json({ statusCode: 400, message: 'No product found' })
    }
    // IMPORT
    product = await Product.create(req.body)
    await product.addWarehouse(warehouseId, { transaction: transaction })
  }
  
  await transaction.commit()
  return res.json({ statusCode: 200, data: product })
} catch (error) {
  await transaction.rollback()
  console.log(error)
  return res.json({ statusCode: 400, message: error.message })
}

  const warehouse = await Warehouse.findOne({ where: { id: warehouseId }})
  const products = await warehouse.getProducts()
  return res.json({ data: products })