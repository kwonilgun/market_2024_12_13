/**
 * params = {
      TableName: "Product",
      Item: {
        id: productId,
        name: req.body.name,
        description: req.body.description,
        // richDescription: req.body.richDescription,
        // image: `${basePath}${fileName}`, //http://localhost:3000/public/upload/image-232323  //스토리지를 ams로 변경함으로써 http 주소를 fileLocation으로 변경함.
        image: fileLocation,
        brand: req.body.brand,
        price: req.body.price,
        discount: req.body.discount, //2023-06-21 추가
        category: categoryId,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,

        // 2023-01-29 추가
        user: req.body.user,
        // 2023-11-14 : 추가
        comments: [],
      },
    };
 */

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  richDescription?: string;
  image?: string;
  brand?: string;
  price?: string;
  discount?: string; //2023-06-21 추가
  category?: {id: string};
  countInStock?: string;
  rating?: string;
  numReviews?: string;
  isFeatured?: string;

  // 2023-01-29 추가
  user?: string;
  // 2023-11-14 : 추가
  comments?: string;
}
