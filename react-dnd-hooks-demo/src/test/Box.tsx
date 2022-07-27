import React, { CSSProperties } from 'react';
import { useDrag } from 'react-dnd';
const style: CSSProperties = {
  width: 200,
  height: 50,
  lineHeight: '50px',
  background: 'pink',
  margin: '30px auto',
};

const Box = () => {
    const [, drager] = useDrag({
        type: 'Box'
    })
  return (<div ref={drager} style={style}>可拖拽组件 Box</div>);
};

export default Box;
