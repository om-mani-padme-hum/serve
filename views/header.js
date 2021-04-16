module.exports = (req, res, next) => {
  const p = req.page;
  
  /** Begin HTML */
  p.html();
  p.head();
  
  /** Add some required Bootstrap 4 meta tags */
  p.meta().charset(`utf-8`);
  p.meta().name(`viewport`).content(`width=device-width, initial-scale=1, shrink-to-fit=no`);
  
  /** Give the page a title */
  p.title().text(`My Application`);
  
  /** Include external JavaScript */
  p.script().src(`/js/jquery.min.js`);
  p.script().src(`/js/jquery.color.min.js`);
  p.script().src(`/js/popper.min.js`);
  p.script().src(`/js/bootstrap.min.js`);
  p.script().src(`/js/numeral.min.js`);
  p.script().src(`/js/moment.min.js`);
  p.script().src(`/js/moment-timezone-with-data.min.js`);
  
  /** Include browserify'd JavaScript */
  p.script().src(`/js/constants.min.js`);
  p.script().src(`/js/models.min.js`);

  /** Include external CSS */
  p.link().rel(`stylesheet`).href(`/css/bootstrap.min.css`).media(`all`);
  
  /** Start page body */
  p.body();
  
  /** Call next express route */
  next();
};
