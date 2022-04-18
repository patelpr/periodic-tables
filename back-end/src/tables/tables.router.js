const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/free").get(controller.available).all(methodNotAllowed);

router
  .route("/:table_id/seat/")
  .put(controller.occupy)
  .delete(controller.remove)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
