'use strict';
Function.prototype.bind = function(ctx) {
  var fn = this;
  return function() {
    fn.apply(ctx, arguments);
  };
};
window.L_DISABLE_3D = true;
