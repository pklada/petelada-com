
$ ->
  if $('.splash').length > 0
    $('.splash').waitForImages(
      finished: ->
        $('.splash').addClass('is-loaded')
        $('.post-container').addClass('is-ready')
      each: ->
      waitForAll: true
    )
