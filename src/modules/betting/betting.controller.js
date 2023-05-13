const httpStatus = require("http-status");
const Betting = require("./betting.model");
const APIError = require("../../helpers/APIError");

async function create(req, res, next) {
  const room = new Betting(req.body);
  try {
    const savedRoom = await room.save();

    req.io.to("fightRoom").emit("savedRoom", savedRoom);

    return res.json(savedRoom);
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const bettings = await Betting.list();
    return res.json(bettings);
  } catch (error) {
    return next(error);
  }
}

async function socketlist() {
  try {
    const bettings = await Betting.list();
    return bettings;
  } catch (error) {
    return error;
  }
}

module.exports = {
  create,
  list,
  socketlist,
};
