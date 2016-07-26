

$(document).ready(function() {

  var $items = $('.top-nav__nav a');

  var bindEls = function() {
    $items.on('mouseover.ripple', function(e) {
      positionRipple(e, this, 'first');
    });
  }

  $items.on('mousedown.ripple', function(e) {
    positionRipple(e, this, 'second');
  });

  var updateCoords = function(e, el) {
    x = e.pageX - $(el).offset().left;
    y = e.pageY - $(el).offset().top;
    return {x:x, y:y};
  }

  var positionRipple = function(e, el, which) {
    var $ripple;
    if(which === 'first') {
      $ripple = $(el).find('.ripple--hover');
    } else {
      $ripple = $(el).find('.ripple--click');
    }
    var x = 0;
    var y = 0;

    var coords = updateCoords(e, el);

    $ripple.css({
      left: coords.x,
      top: coords.y
    });

    if(which === 'first') {
      $items.off('mouseover.ripple');
    }

    $(el).one('mouseout', function() {
      bindEls();
    });
  }

  bindEls();

});
