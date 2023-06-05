import ProgramModel from "../models/programs_model.js";

export const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
    };
    const response = await ProgramModel.paginate({}, options);
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};

export const get = async (req, res, next) => {
  try {
    let { id } = req.params;

    const program = await ProgramModel.findOne({ _id: id });
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }
    res.status(200).send({ success: true, program });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};

export const add = async (req, res, next) => {
  try {
    const program = await ProgramModel.create({
      ...req.body,
    });
    res.status(200).send({ success: true, program });
  } catch (err) {
    next(err);
  }
};

export const del = async (req, res, next) => {
  try {
    let { id } = req.params;
    const program = await ProgramModel.findByIdAndDelete({ _id: id });
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }
    res.status(200).send({ success: true, program });
  } catch (err) {
    next(err);
  }
};

export const deactivate = async (req, res, next) => {
  try {
    let filter = req.params.id;
    const program = await ProgramModel.findOneAndUpdate(
      filter,
      { isActive: false },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }
    res.status(200).send({ success: true, program });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    let filter = req.params.id;
    let update = req.body;
    const program = await ProgramModel.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }
    res.status(200).send({ success: true, program });
  } catch (err) {
    next(err);
  }
};

export const filterProgram = async (req, res, next) => {
  const { district, city, sector } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const query = { role: "organization" };

    if (district) {
      query.district = district;
    }
    if (city) {
      query.city = city;
    }
    if (sector) {
      query.sector = sector;
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    const organizations = await ProgramModel.paginate(query, options);

    res.status(200).json({ success: true, organizations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving organizations",
      error: error.message,
    });
  }
};

const ProgramController = {
  getAll,
  get,
  add,
  del,
  deactivate,
  update,
  filterProgram,
};
export default ProgramController;