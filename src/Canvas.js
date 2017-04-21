import React, { Component, PropTypes } from 'react'

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
    const image = document.getElementById('diagramImg')
    this.setState({ imageName: e.target.value })
    this.canvasContext.drawImage(image, 0, 0)
  }

  render () {
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
              <img id="diagramImg" src="https://image.slidesharecdn.com/workflow-logisticsset-091118022535-phpapp01/95/powerpoint-work-flow-logistics-set-3-638.jpg" />
            </div>
        </div>
    )
  }
}

export default Canvas;
