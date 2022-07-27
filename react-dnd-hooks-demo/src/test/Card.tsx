import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const Card = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'Card',
    drop(item) {
      console.log(item);
    },
  });

  const [, drag] = useDrag({
    type: 'Card',
    item: { id: '1' },
    end(draggedItem, monitor) {
      console.log(draggedItem, monitor);
    },
  });

  // 使用 drag 和 drop 包装 ref
  drag(drop(ref));

  // 将变量 ref 传给元素的 ref 即可
  return <div ref={ref}>既可以被拖动也可以接收拖动组件</div>;
};

export default Card;
