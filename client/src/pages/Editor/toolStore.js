import { Listenable } from 'pockito'

const store = new Listenable({
  initialState: {
    tool: 'ellipse',
    fill: '#ffdab9',
    stroke: '#ff7f50',
    strokeWidth: 1,
  }
})

export { store as toolStore }
