import React from 'react';

export default function Tooltip({hoveredBar, x, y}) {
    const styles = {
      left: `${x+150}px`,
      top: `${y + 40}px`,
      position: 'absolute',
      fontSize: '12px',
      border: '1px solid #6F257F',
      background: '#ffffff',
      width: '10%'
    }
    // console.log(hoveredBar)
    let name = hoveredBar.key ? hoveredBar.key : hoveredBar.MajorName;
    let value = hoveredBar.value ? hoveredBar.value.total : hoveredBar.TotalStudents;
    if(Array.isArray(hoveredBar)){
      name = hoveredBar[0]
      value = hoveredBar[1]
    }

    return (
      <div className="Tooltip" style={styles}>
            <p>{name}</p>
            <p>Students: {value}</p>
      </div>
    )
  }