// function to catch errors in async code
export default (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
