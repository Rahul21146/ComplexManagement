
const express = require("express");

const router = express.Router();

// =====================================================
// MIDDLEWARE
// =====================================================

const { auth, isOwner } = require("../middlewares/auth.js");

// =====================================================
// AUTH CONTROLLERS
// =====================================================

const {
    register
} = require("../controllers/loginRegisterControllers.js/register");

const {
    login
} = require("../controllers/loginRegisterControllers.js/login");

const {
    sendOTP,
    verifyOTP
} = require("../controllers/authcontrollers.js");

const {
    forgotPassword,
    resetPassword,
    changePassword
} = require("../controllers/forget&resetPassword.js");

// =====================================================
// AUTH ROUTES
// =====================================================

router.post(
    "/register",
    register
);

router.post(
    "/auth/send-otp",
    sendOTP
);

router.post(
    "/auth/verify-otp",
    verifyOTP
);

router.post(
    "/auth/login",
    login
);

router.post(
    "/auth/forgot-password",
    forgotPassword
);

router.post(
    "/auth/reset-password",
    resetPassword
);

router.post(
    "/auth/change-password",
    auth,
    changePassword
);


// =====================================================
// COMPLEX CONTROLLERS
// =====================================================

const {
    createComplex
} = require("../controllers/complex/createComplex.js");

const {
    getMyComplexes
} = require("../controllers/complex/getMyComplex.js");

const {
    updateComplex
} = require("../controllers/complex/updateComplex.js");

const {
    inactiveComplex
} = require("../controllers/complex/inAciveComplex.js");


// =====================================================
// COMPLEX ROUTES
// =====================================================

// Create Complex
router.post(
    "/createcomplex",
    auth,
    isOwner,
    createComplex
);


// Get Owner's Complexes
router.get(
    "/getcomplex",
    auth,
    isOwner,
    getMyComplexes
);


// Update Complex
router.put(
    "/updatecomplex/:id",
    auth,
    isOwner,
    updateComplex
);


// Make Complex Inactive
router.patch(
    "/complex/:id/inactive",
    auth,
    isOwner,
    inactiveComplex
);

const {
    getSpecificComplex
} = require("../controllers/complex/getspecificComplex.js");


router.get(
    "/complex/:complexId",
    auth,
    isOwner,
    getSpecificComplex
);


// =====================================================
// FLOOR CONTROLLERS
// =====================================================

const {
    createFloor
} = require("../controllers/floors/createFloor.jsx");

const {
    updateFloor
} = require("../controllers/floors/updateFloor.jsx");


// =====================================================
// FLOOR ROUTES
// =====================================================

// Create Floor
router.post(
    "/createfloor",
    auth,
    isOwner,
    createFloor
);


// Update Floor
router.post(
    "/updatefloor/:id",
    auth,
    isOwner,
    updateFloor
);

const {
    getFloorsByComplex
} = require("../controllers/floors/getFloors.jsx");


// =====================================================
// TEST ROUTE
// =====================================================

router.get(
    "/",
    (req, res) => {
        res.send("Hello from the route!");
    }
);


router.get(
    "/floors/:complexId",
    auth,
    isOwner,
    getFloorsByComplex
);




//roooms
const {
    createRoom
} = require("../controllers/rooms/createRooms.js");
const {
  getRoomsByComplex
} = require("../controllers/rooms/getRooms.js");

const {
    updateRoom
} = require("../controllers/rooms/updateRooms.js");



router.post(
  "/createroom/:complexId",
  auth,
  isOwner,
  createRoom
);

router.get(
  "/rooms/:complexId",
  auth,
  isOwner,
  getRoomsByComplex
);


router.put(
  "/updateroom/:complexId/:id",
  auth,
  isOwner,
  updateRoom
);

//tenants

const {
    createTenant
} = require("../controllers/tenent/createTanent.js");

router.post(
  "/createtenant/:complexId/:floorId",
  auth,
  isOwner,
  createTenant
);


const {
  getTenantsByComplex
} = require("../controllers/tenent/getTenants.js");

router.get(
  "/tenants/:complexId",
  auth,
  isOwner,
  getTenantsByComplex
);



const {
  getVacantRoomsByFloor,
} = require("../controllers/rooms/getFloorRooms.js");

router.get(
  "/rooms/:complexId/:floorId/vacant",
  auth,
  isOwner,
  getVacantRoomsByFloor
);

module.exports = router;
