(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

$(document).ready(function() {
  var fireworks = (function() {

    var animating = false;
    var hovered = false;

    var getFontSize = function() {
      return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    var canvas = document.querySelector('.anim-canvas');
    var ctx = canvas.getContext('2d');
    var numberOfParticules = 12;
    var distance = 100;
    var x = 0;
    var y = 0;
    var animations = [];

    var setCanvasSize = function() {
      canvas.width = $(canvas).innerWidth();
      canvas.height = $(canvas).innerHeight();
    }

    var updateCoords = function(e, el) {
      x = $(el).position().left + ($(el).innerWidth() / 2);
      y = $(el).position().top + ($(el).innerHeight() / 2);
    }

    var colors = ['#96CF77', '#629D41', '#FDFF85', '#ffffff', '#25D5C7'];

    var createCircle = function(x,y) {
      var p = {};
      p.x = x;
      p.y = y;
      p.color = '#9CCB81';
      p.radius = 0;
      p.alpha = .6;
      p.lineWidth = 6;
      p.draw = function() {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = p.lineWidth;
        ctx.strokeStyle = p.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      return p;
    }

    var createParticule = function(x,y) {
      var p = {};
      p.x = x;
      p.y = y;
      p.color = colors[anime.random(0, colors.length - 1)];
      p.radius = anime.random(getFontSize() / 2, getFontSize());
      p.draw = function() {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      return p;
    }

    var createParticles = function(x,y) {
      var particules = [];
      for (var i = 0; i < numberOfParticules; i++) {
        var p = createParticule(x, y);
        particules.push(p);
      }
      return particules;
    }

    var removeAnimation = function(animation) {
      var index = animations.indexOf(animation);
      if (index > -1) animations.splice(index, 1);
      animating = false;
    }

    var animateParticules = function(x, y) {
      animating = true;
      setCanvasSize();
      var particules = createParticles(x, y);
      var circle = createCircle(x, y);
      var particulesAnimation = anime({
        targets: particules,
        x: function(p) { return p.x + anime.random(-distance, distance); },
        y: function(p) { return p.y + anime.random(-distance, distance); },
        radius: 0,
        duration: function() { return anime.random(1200, 1800); },
        easing: 'easeOutExpo',
        complete: removeAnimation
      });
      var circleAnimation = anime({
        targets: circle,
        radius: function() { return anime.random(getFontSize() * 4, getFontSize() * 6); },
        lineWidth: 0,
        alpha: {
          value: 0,
          easing: 'linear',
          duration: function() { return anime.random(400, 600); }
        },
        duration: function() { return anime.random(1200, 1800); },
        easing: 'easeOutExpo',
        complete: removeAnimation
      });
      animations.push(particulesAnimation);
      animations.push(circleAnimation);
    }

    var mainLoop = anime({
      duration: Infinity,
      update: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animations.forEach(function(anim) {
          anim.animatables.forEach(function(animatable) {
            animatable.target.draw();
          });
        });
      }
    });

    $('.js-boom').on('click', function(e) {
      updateCoords(e, this);
      animateParticules(x, y);
    })

    $('.js-boom-on-hover').on('mouseover', function(e) {
      if (!animating && !hovered) {
        hovered = true;
        updateCoords(e, this);
        animateParticules(x, y);
      }
    })

    $('.js-boom-on-hover').on('mouseout', function() {
      hovered = false;
    });

    window.addEventListener('resize', setCanvasSize, false);

    return {
      boom: animateParticules
    }

  })();
});


var firebase = new Firebase("https://petelada-com.firebaseio.com/");
var k = firebase.child('kudos');



Kudos = function($el){

  this.postID = $el.parents('.post').data('post-id');
  this.$el = $el;
  this.initKudos();
  this.fetchKudos();

}

Kudos.prototype = {

  addKudos: function(){
    var _that = this;
    $kudos = _that.$el;
    k.child(_that.postID).once('value', function(d){
      if(d.val()){
        var kud = d.val().kudos;
      }else{
        kud = 0
      }
      k.child(_that.postID).set({
        kudos: kud + 1
      });
      _that.renderKudos(kud+1);
      $.cookie('kudos-' + _that.postID, 'kudos', { expires: 365, path: '/' });

      // track the click in GA
      ga('send', 'event', 'kudosButton', 'click', 'kudos-' + _that.postID);

      // refresh other kudos components if they exist
      if (window.pageKudos) {
        $(window.pageKudos).each(function(){
          $(this)[0].fetchKudos();
          $(this)[0].disableKudos();
        });
      }

      _that.disableKudos();
    });
  },

  disableKudos: function() {
    var that = this;
    $kudos = that.$el;
    $kudos.addClass('kudos-given');
    $kudos.off('click');
    $kudos.off('mousedown');
    $kudos.off('mouseup');
    $kudos.removeAttr('href');
  },

  renderKudos: function(count) {
    var that = this;
    if(count === 0){
      return;
    }
    $kudos = that.$el;
    $kudos.removeClass('no-kudos');
    $count = $kudos.find('.post__kudos__count');
    $count.html(count);
  },

  fetchKudos: function() {
    var count;
    var _that = this;
    k.child(_that.postID).once('value', function(d){
      if(d.val()){
        count = d.val().kudos;
      }else{
        count = 0;
      }
      _that.renderKudos(count);
      $kudos.removeClass('is-loading');
    });
  },

  initKudos: function() {
    var that = this;
    $kudos = that.$el;

    $kudos.addClass('is-loading');

    if($.cookie('kudos-' + that.postID) === 'kudos'){
      $kudos.addClass('kudos-given');
      $kudos.removeAttr('href');
    }else{
      $kudos.on('click', function(e){
        e.preventDefault();
        that.addKudos(that.postID.toString());
      });

      $kudos.on('mousedown', function(){
        $(this).addClass('is-pressed');
      });

      $kudos.on('mouseup', function(){
        $(this).removeClass('is-pressed');
      });

      $kudos.on('mouseout', function(){
        $(this).removeClass('is-pressed');
      });
    }
  }

}

function initButtons() {
  $('.button').on('mouseover', function(){
    $(this).addClass('is-pressed');
  });

  $('.button').on('mouseup, mouseout', function(){
    $(this).removeClass('is-pressed');
  });
}

function isMobile() {
  return $('.js-mobile-test').css('visibility') == 'visible';
}

$(document).ready(function(){

  if( $('.post__kudos').length > 0){
    window.pageKudos = [];
    $('.post__kudos').each(function(){
      var kudos = new Kudos($(this));
      window.pageKudos.push(kudos);
    });

  }

  var heroHeight = $('.splash').innerHeight();

  $(window).on('scroll', function(){

    if(isMobile()) {
      return;
    }

    var scrollTop = $(window).scrollTop();

    if(scrollTop > heroHeight) {
      if (!$('body').hasClass('collapsed-header')) {
        $('body').addClass('collapsed-header');
        setTimeout(function(){
          $('.splash').addClass('is-ready');
        }, 1);

        $('.container').css({
          paddingTop: heroHeight
        });
      }
    } else {
      $('body').removeClass('collapsed-header');
      $('.splash').removeClass('is-ready');
      $('.container').css({
        paddingTop: 0
      });
    }

    if(scrollTop > (heroHeight + 200)) {
      $('.splash').addClass('is-visible');
    } else {
      $('.splash').removeClass('is-visible');
    }

  });


});



Profile = function(el){
  this.$el = $(el);
  this.targetImage = this.$el.data('target-image');
  this.initProfile();
}

Profile.prototype = {

  initProfile: function() {
    var _that = this;
    $el = _that.$el;

    _that.insertPlaceholder();

    var img = new Image();
    img.onload = function() {

      _that.$el.css({
        backgroundImage: "url(/photos/" + _that.targetImage + ".jpg)"
      });

      setTimeout(function() {
        _that.$placeholder.css({
          opacity: 0
        })
      }, 1);
    }

    img.src = "/photos/" + _that.targetImage + ".jpg";

  },

  insertPlaceholder: function() {
    var _that = this;
    _that.$placeholder = $('<div />');
    _that.$placeholder.addClass('photo-box__placeholder');
    _that.$placeholder.css({
      backgroundImage: "url(/gen/photos/thumb/" + _that.targetImage + "-thumbnail.jpg"
    });
    _that.$el.append(_that.$placeholder);
  }

}

$(document).ready(function(){

  if( $('.photo-box').length > 0){
    var profile = new Profile($('.photo-box')[0]);
  }
});



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

$(function() {
  if ($('.splash').length > 0) {
    return $('.splash').waitForImages({
      finished: function() {
        $('.splash').addClass('is-loaded');
        $('.post-container').addClass('is-ready');
        return $('.post-spinner').addClass('is-hidden');
      },
      each: function() {},
      waitForAll: true
    });
  }
});

},{}]},{},[1])