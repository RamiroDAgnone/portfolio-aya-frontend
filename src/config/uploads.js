export const UPLOAD_CONCURRENCY =
  Number(process.env.REACT_APP_UPLOAD_CONCURRENCY) > 0
    ? Number(process.env.REACT_APP_UPLOAD_CONCURRENCY)
    : 2;