

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
