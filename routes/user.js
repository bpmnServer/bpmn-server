"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * GET users listing.
 */
const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
    res.send("respond with a resource");
});
exports.default = router;
//# sourceMappingURL=user.js.map