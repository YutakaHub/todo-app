import React, { useRef } from 'react'
import './Card.css'
import "react-datepicker/dist/react-datepicker.css"
import { useDrag, useDrop } from 'react-dnd';

const Card = ({ id, sortKey, todoText, completionDate, completeDateTime, completeFlg, moveTodoItems, putMoveTodos, backupData }) => {
  const date = new Date(completionDate);
  const date2 = new Date(completeDateTime);
  const ref = useRef(null);

  const [{ isDragging, canDrag }, drag] = useDrag({
    type: 'item',
    item: { sortKey },//, todoText, completionDate, completeFlg, completeDateTime },
    isDragging: monitor => monitor.getItem().sortKey === sortKey,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    })
  })
  const [, drop] = useDrop({
    accept: 'item',
    //ホバー外れた時に発火
    leave: (item, monitor) => {

    },
    //ホバー時に発火
    hover: (item, monitor) => {
      const dragSortKey = item.sortKey
      const hoverSortKey = sortKey
      if (dragSortKey === hoverSortKey) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      if (hoverBoundingRect === undefined) return;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const getClientOffset = monitor.getClientOffset()?.y
      if (getClientOffset === undefined) return;
      const hoverActualY = getClientOffset - hoverBoundingRect.top

      if (dragSortKey < hoverSortKey && hoverActualY < hoverMiddleY) return
      if (dragSortKey > hoverSortKey && hoverActualY > hoverMiddleY) return

      moveTodoItems(dragSortKey, hoverSortKey)
      item.sortKey = hoverSortKey
    },
    drop: async () => await putMoveTodos(sortKey),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  })
  drag(drop(ref))

  return (
    <div ref={ref}
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: canDrag ? 'move' : 'default',
      }}
      onDragStart={() => backupData(sortKey)}
    >
      {!isDragging && (
        <div className='cardText'>{todoText}{isDragging}</div>
      )}
      {isDragging && (
        <div className='cardText'>{todoText}{isDragging && '😱'}</div>
      )}
      <div className='cardDate'>
        {Number(date) ? (
          <div className='date'>完了予定日:  {date.toLocaleDateString('ja-JP')} </div>
        ) : (<div />)}
        {completeFlg ? (
          <div className='date'>完了日:  {date2.toLocaleDateString('ja-JP')} </div>
        ) : (<div />)}
      </div>
    </div>
  )
}

export default Card;
