import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

/* CSS */
import cssStyle from './style'

export default class HorizontalScroll extends Component {
  static propTypes = {
    className: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      outerWidth: 0,
      innerWidth: 0,
      trackWidth: 0,
      trackLeftMax: 0
    }

    this.outerId = 'horizontalScrollOuter' + Math.random().toFixed(5).replace('0.', '')
    this.innerId = 'horizontalScrollInner' + Math.random().toFixed(5).replace('0.', '')
    this.trackId = 'horizontalScrollTrack' + Math.random().toFixed(5).replace('0.', '')

    this.wrapperRef = createRef()
    this.onGlobalWheel = this.onGlobalWheel.bind(this)

    this.progress = 0
    this.delay = 1000 / 60
  }

  componentDidMount () {
    this.setStyleHeader() // Set the style to the <link>
    this.setupConfigBasedOnHTML()
    document.body.addEventListener('wheel', this.onGlobalWheel, { passive: false })
  }

  componentWillUnmount () {
    document.body.removeEventListener('wheel', this.onGlobalWheel)
  }

  setupConfigBasedOnHTML () {
    setTimeout(() => {
      const outerElement = document.getElementById(this.outerId)
      const innerElement = document.getElementById(this.innerId)
      if (!outerElement || !innerElement) return this.setupConfigBasedOnHTML()

      const outerWidth = outerElement.offsetWidth
      const innerWidth = innerElement.offsetWidth
      const trackWidth = (outerWidth / innerWidth).toFixed(2)
      this.setState({
        outerWidth,
        innerWidth,
        trackWidth: trackWidth,
        trackLeftMax: (1 - parseFloat(trackWidth)) * outerWidth
      })
    }, 500)
  }

  onGlobalWheel (e) {
    if (this.wrapperRef && this.wrapperRef.current.contains(e.target)) {
      e.preventDefault()
    }
  }

  updateTrackLeft (trackLeft) {
    const { trackLeftMax, outerWidth, innerWidth } = this.state
    trackLeft = Math.max(trackLeft, 0)
    trackLeft = Math.min(trackLeft, trackLeftMax)
    document.getElementById(this.trackId).style.left = trackLeft + 'px'

    const innerTransformFrom = parseFloat(document.getElementById(this.innerId).style.transform.replace(/[^\d.]/g, '')) || 0
    const innerTransformTo = ((trackLeft / outerWidth) * innerWidth).toFixed(2)
    this.updateInnerTransform(innerTransformFrom, innerTransformTo)
  }

  updateInnerTransform (from, to) {
    if (from === to) return
    const diff = to - from
    const duration = 950
    const startTime = new Date()
    const delay = 1000 / 60
    let progress = 0
    let time = delay

    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    const step = () => {
      progress = new Date() - startTime
      const tweenValue = this.tween({ from, time, duration, diff })
      document.getElementById(this.innerId).style.transform = `translateX(-${tweenValue}px)`

      if (progress >= time) {
        time = progress > time
          ? progress + delay - (progress - time)
          : progress + delay - 1
        if (time < progress + 1) {
          time = progress + 1
        }
      }

      if (time < duration) {
        this.animationFrameId = window.requestAnimationFrame(step)
      }
    }

    this.animationFrameId = window.requestAnimationFrame(step)
  }

  tween ({ from, time, duration, diff }) {
    const myTime = time / duration
    const ts = myTime * myTime
    const tc = ts * myTime
    return from + diff * (0.499999999999997 * tc * ts + -2.5 * ts * ts + 5.5 * tc + -6.5 * ts + 4 * myTime)
  }

  onWheel (e) {
    const currentTrack = document.getElementById(this.trackId)
    if (currentTrack) {
      const currentTrackLeft = currentTrack.style.left || '0px'
      this.updateTrackLeft(parseFloat(currentTrackLeft.replace('px', '')) + e.deltaY)
    }
  }

  onTrackMouseDown (e) {
    e.stopPropagation()
    e.preventDefault()
    this.prePosX = null
    document.onmousemove = this.onTrackMouseMove.bind(this)
    document.onmouseup = this.onTrackMouseUp.bind(this)
  }

  onTrackMouseMove (e) {
    e.preventDefault()
    const element = document.getElementById(this.trackId)
    const pos1 = !this.prePosX ? 0 : this.prePosX - e.clientX
    this.prePosX = e.clientX
    this.updateTrackLeft(element.offsetLeft - pos1)
  }

  async onTrackMouseUp () {
    document.onmouseup = null
    document.onmousemove = null
  }

  onTouchMove (e) {
    const element = document.getElementById(this.trackId)
    const pos1 = !this.prePosX ? 0 : this.prePosX - e.touches[0].clientX
    this.prePosX = e.touches[0].clientX
    this.updateTrackLeft(element.offsetLeft - pos1)
  }

  /**
   * Set style tag in header
   * in this way we can insert default css
   */
  setStyleHeader () {
    const head = document.getElementsByTagName('head')[0]
    if (!head.querySelector('style[id="react-horizontal-scrolling"]')) {
      const tag = document.createElement('style')
      tag.id = 'react-horizontal-scrolling'
      tag.innerHTML = cssStyle
      /* eslint-disable */
      if (typeof __webpack_nonce__ !== 'undefined' && __webpack_nonce__) {
        tag.setAttribute('nonce', __webpack_nonce__)
      }
      /* eslint-enable */
      head.insertBefore(tag, head.firstChild)
    }
  }

  render () {
    const { className, children } = this.props
    const { trackWidth } = this.state
    const isArrayChild = Array.isArray(children)
    return (
      <div className={`HorizontalScroll ${className || ''}`} ref={this.wrapperRef}>
        <div className='HorizontalScrollOuter' id={this.outerId} onWheel={::this.onWheel}>
          <div
            id={this.innerId}
            className='HorizontalScrollInner'
            onTouchMove={::this.onTouchMove}
          >
            {!isArrayChild &&
              <div className='HorizontalScrollInnerChildren'>{children}</div>}
            {isArrayChild &&
              children.map((child, idx) => (
                <div key={idx} className='HorizontalScrollInnerChildren'>
                  {child}
                </div>
              ))}
          </div>
        </div>
        {trackWidth > 0 && trackWidth < 1 &&
          <div className='HorizontalScrollTrack'>
            <div
              id={this.trackId}
              className='HorizontalScrollTrackInner'
              style={{
                width: parseFloat(trackWidth) * 100 + '%'
              }}
              onMouseDown={::this.onTrackMouseDown}
            />
          </div>}
      </div>
    )
  }
}
