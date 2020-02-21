// import jwt from 'jsonwebtoken';
// import validateBody from '../../middleware/validate';
import connection from '../database/connection';

class productController {
  static create(request, response) {
    const { name, price } = request.body;

    if (!name) {
      return response.status(400).json({
        status: 400,
        error: 'Please provide the name of your product'
      });
    }

    if (!price) {
      return response.status(400).json({
        status: 400,
        error: 'Please provide the price of your product'
      });
    }

    const newProduct = {
      name,
      price
    };

    const query = `INSERT INTO products ("name", "price", "status") VALUES('${newProduct.name}','${newProduct.price}', 'available') returning * `;
    return connection
      .query(query)
      .then(result => {
        if (result.rowCount >= 1) {
          return response.status(201).send({
            status: 201,
            message: 'Product added successfully',
            data: result.rows[0]
          });
        }
      })
      .catch(error => {
        return response.status(500).send({
          status: 500,
          error:
            'Error adding product, ensure you provide valid product details'
        });
      });
  }

  static getAllProducts(request, response) {
    const query = 'SELECT * FROM products';
    return connection
      .query(query)
      .then(result => {
        if (result.rowCount === 0) {
          response.status(404).send({
            status: 404,
            error: 'There are no products records'
          });
        }
        return response.status(200).send({
          status: 200,
          message: 'Products successfully retrieved',
          data: result.rows
        });
      })
      .catch(error => {
        response.status(500).send({
          status: 500,
          error: 'Error fetching all products'
        });
      });
  }
}

export default productController;
