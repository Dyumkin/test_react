/**
 * Extend response
 *
 * @param req
 * @param res
 * @param next
 */
export default (req, res, next) => {

  /**
   * alias for next callback
   *
   * @param error
   * @returns {*}
   */
  res.error = next;

  /**
   * Send success response
   *
   * @param data
   * @returns {*}
   */
  res.success = (data) => {
    data = data || {};
    return res.json({success: true, data});
  };

  return next();
};
