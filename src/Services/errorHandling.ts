export const asyncHandler = (fn: any) => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch((err: any) => {
      return next(new Error(err));
    });
  };
};

export const globalErrorHandle = (err: any, req: any, res: any, next: any) => {
  if (err) {
    if (process.env.MOOD == "DEV") {
      return res
        .status(err.cause || 500)
        .json({ message: "catch error", stack: err.stack ? err.stack : err });
    } else {
      return res.status(err.cause || 500).json({ message: "catch error" });
    }
  }
};
