import React from "react"

const Table = (props) => {
  console.log(props);
  return(
    <div className="overflow-x-scroll">
      {props.children}
    </div>
  )
}

export default Table;