
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
