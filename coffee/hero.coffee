
$ ->
  if $('.splash').length > 0
    $('.splash').waitForImages(
      finished: ->
        $('.splash').addClass('is-loaded')
      each: ->
      waitForAll: true
    )
