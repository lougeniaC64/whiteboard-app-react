import React, { Component, PropTypes } from 'react'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import { fetchItem } from './actions'

class Canvas extends Component {
  constructor() {
    super()

    this.state = {
        canDraw: false,
        xCoordinates: [],
        yCoordinates: [],
        draggingHistory: [],
        colorHistory: [],
        lineWidthHistory: [],
        imageName: '',
        imageUrl: ''
    }

    this.draw = this.draw.bind(this)
    this.startDrawing = this.startDrawing.bind(this)
    this.stopDrawing = this.stopDrawing.bind(this)
    this.changeDrawingColor = this.changeDrawingColor.bind(this)
    this.changeWidth = this.changeWidth.bind(this)
    this.clearCanvas = this.clearCanvas.bind(this)
    this.loadImgFile = this.loadImgFile.bind(this)
  }

  componentWillMount () {
    // this.props.fetchItem(this.props.id)
  }

  componentDidMount() {
    const rootDiv = document.getElementById('mount'),
        rootDivParent = rootDiv.parentNode
    this.canvasContext = this.canvas.getContext('2d')  
    this.canvas.setAttribute('height', rootDivParent.clientHeight - 32) //Not a magic number
    this.canvas.setAttribute('width', rootDivParent.clientWidth - 8)  //Not a magic number
  }

  draw(e) {
    if(this.state.canDraw) {
        this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
        this.redraw();
    }
  }

  startDrawing(e) {
    const mouseX = e.pageX - this.canvas.offsetLeft
    const mouseY = e.pageY - this.canvas.offsetTop

    this.setState({ canDraw: true })
    this.addClick(mouseX, mouseY)
    this.redraw()
  }

  stopDrawing(e) {
      this.setState({ canDraw: false })
  }

  addClick(x, y, dragging) {
      this.state.xCoordinates.push(x)
      this.state.yCoordinates.push(y)
      this.state.colorHistory.push(this.canvasContext.strokeStyle)
      this.state.lineWidthHistory.push(this.canvasContext.lineWidth)
      this.state.draggingHistory.push(dragging)
  }

  clearCanvas(e) {
    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height)
    if (e) {
      this.setState({
        canDraw: false,
        xCoordinates: [],
        yCoordinates: [],
        draggingHistory: [],
        colorHistory: [],
        lineWidthHistory: [],
        imageName: '',
        imageUrl: ''
      })
    }

  }

  redraw() {
    // this.clearCanvas()
    this.canvasContext.lineJoin = 'round'
    this.canvasContext.lineWidth = 5

    this.state.xCoordinates.map((xCoordinate, index) => {
        this.canvasContext.beginPath()
        if(this.state.draggingHistory[index] && index) {
            this.canvasContext.moveTo(this.state.xCoordinates[index - 1], this.state.yCoordinates[index - 1])
        } else {
            this.canvasContext.moveTo(this.state.xCoordinates[index] - 1, this.state.yCoordinates[index])
        }
        this.canvasContext.lineTo(this.state.xCoordinates[index], this.state.yCoordinates[index])
        this.canvasContext.closePath();
        this.canvasContext.strokeStyle = this.state.colorHistory[index]
        this.canvasContext.lineWidth = this.state.lineWidthHistory[index]
        this.canvasContext.stroke();
    })
  }

  changeDrawingColor(e) {
      this.canvasContext.strokeStyle = e.target.value
  }

  changeWidth(e) {
    this.canvasContext.lineWidth = parseFloat(e.target.value)
  }

  loadImgFile(e) {
    // console.log('file changed') 
    // const imageData = document.getElementById('imgSelector').files[0]
    // const image = document.createElement('img')
    // console.log(document.getElementById('imgSelector').files)
    // document.getElementById('tiger').setAttribute('src', 'https://mainerides.files.wordpress.com/2008/02/snarling-tiger.thumbnail.jpg')
    // const image = e.target.value.toString().includes('tame') ? document.getElementById('tameTiger') : document.getElementById('ferociousTiger')
    const image = document.getElementById('diagramImg')
    this.setState({ imageName: e.target.value })
    // this.canvas.append
    // console.log('image', image)
    this.canvasContext.drawImage(image, 0, 0)
  }

  render () {
    // const { item } = this.props
    const imgDivStyle = { display: 'none' }
    return (
        <div>
            <div>
              color: <input type="color" value={this.state.drawingColor} onChange={this.changeDrawingColor} />
              &nbsp;&nbsp;&nbsp;
              width:&nbsp;
              <select onChange={this.changeWidth}>
                  <option value="0.25">small</option>
                  <option value="2.5">medium</option>
                  <option value="5.0">large</option>
                  <option value="10.0">huge</option>
              </select>
              &nbsp;&nbsp;&nbsp;
              <button onClick={this.clearCanvas}>clear whiteboard</button>
              &nbsp;&nbsp;&nbsp;
              <input id="imgSelector" type="file" value={this.state.imageName} accept="image/*" onChange={this.loadImgFile} />
            </div>
            <canvas id="whiteBoard" 
                ref={(canvas) => { this.canvas = canvas }} 
                onMouseDown={this.startDrawing} 
                onMouseMove={this.draw} 
                onMouseUp={this.stopDrawing} 
                onMouseLeave={this.stopDrawing}>
            </canvas>
            <div style={imgDivStyle}>
              {/*<img id="tameTiger" src='https://pbs.twimg.com/profile_images/649767770914209793/7X6SziWj.jpg' />
              <img id="ferociousTiger" src='http://cdn.overclock.net/7/79/900x900px-LL-797a22aa_Roaring-Tiger.jpeg' />*/}
              <img id="diagramImg" src="https://image.slidesharecdn.com/workflow-logisticsset-091118022535-phpapp01/95/powerpoint-work-flow-logistics-set-3-638.jpg" />
            </div>
        </div>
    )
  }
}

export default Canvas;

// Canvas.propTypes = {
//   id: PropTypes.string.isRequired,
//   fetchItem: PropTypes.func.isRequired,
//   item: PropTypes.shape({
//     data: PropTypes.shape({
//       name: PropTypes.string.isRequired
//     }).isRequired
//   })
// }

// export default connect(
//   ({ item }) => ({ item }),
//   (dispatch) => bindActionCreators(
//     {
//       fetchItem
//     },
//     dispatch
//   )
// )(Canvas)
