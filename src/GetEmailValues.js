import React from 'react'

const GetEmailValues = (props) => {
    console.log("Props value in child component",props)
  return (
    <>

    <div 
        style={{
        background: '#1a202c',
        color: 'white',
        borderRadius: '5px',
        padding: '4px',
        width: 'fit-content',
        marginBottom: '3px',
    }}>
      <span>{props.value}</span>
      <button onClick={props.onDelete}><i class="fa-solid fa-circle-xmark " style={{
        marginLeft: '7px',
        fontSize: '14px',
      }}></i></button>
    </div>
      
    </>
  )
}

export default GetEmailValues
