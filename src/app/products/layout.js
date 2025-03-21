import React from 'react'
import Filter from './Filter'


const layout = ({children}) => {
  return (
    <div className='flex'>
       <Filter/>
       {children}
    </div>
  )
}

export default layout