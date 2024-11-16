//! step wise higher order functions
//! const asyncHandler = () => {};
//! const asyncHandler = () => () => {};
//! i.e: const asyncHandler = () => { () => {} };
//! const asyncHandler = (fn) => () => {};
//! const asyncHandler = (fn) => async () => {};

//* wrapper function - try catch based
// err, req, res, next
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     });
//   }
// }

//* wrapper function - promise based
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
  }
}


export { asyncHandler };