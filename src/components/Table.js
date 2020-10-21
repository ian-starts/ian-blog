import React from "react"

const Table = (props) => {
  return(
    <div className="overflow-x-scroll">
      {props.children}
    </div>
  )
}

export default Table;