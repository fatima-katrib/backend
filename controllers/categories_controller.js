import CategoriesModel from "../models/categories_model.js";

export async function getAll(req, res, next) {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
    };
    const response = await CategoriesModel.paginate({}, options);
    res.status(200).send({ success: true, response });
  } catch (err) {
    next(err);
  }
}

export async function get(req, res, next) {
  try {
    let { id } = req.params;
    var validId = mongoose.Types.ObjectId.isValid(id);
    console.log(validId);
    if (!validId) {
      return res.status(400).send({ status: 400, message: "invalid id" });
    }
    const response = await CategoriesModel.findOne({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const response = await CategoriesModel.create({
      ...req.body,
    });
    res.status(200).send({ success: true, response });
  } catch (err) {
    if (err.code == 11000) {
      res.status(400).json("Email already exists");
    } else {
      next(err);
    }
  }
}

export async function del(req, res, next) {
  try {
    let { id } = req.params;
    const response = await CategoriesModel.findByIdAndDelete({ _id: id });
    res.status(200).send({ success: true, response });
  } catch (err) {
    next(err);
  }
}

export async function softDel(req, res, next) {
  try {
    let filter = req.params.id;
    const response = await CategoriesModel.findOneAndUpdate(
      filter,
      { isDeleted: true },
      {
        new: true,
      }
    );
    res.status(200).send({ success: true, response });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    let filter = req.params.id;
    let update = req.body;
    const response = await CategoriesModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).send({ success: true, response });
  } catch (err) {
    next(err);
  }
}
