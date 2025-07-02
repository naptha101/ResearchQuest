import { TitleProvider } from '@/app/Context/TitleContext'
import React from 'react'


const layout = ({children}) => {
  return (
    <div>
<TitleProvider>

{children}
</TitleProvider>

    </div>
  )
}

export default layout