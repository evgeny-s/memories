import React from 'react';

function Card({children, onClick}) {
  return (
    <div className='col-sm-1'>
      <div className="card" onClick={onClick}>
        <div className="card-body">
          <p className="card-text">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
