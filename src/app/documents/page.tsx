import { getDocs } from '@/actions/document'
import DocumentsPage from '@/components/documents'
import React from 'react'

const page = async() => {

  const { docs, customers} = await getDocs()

  
  
  
  return (
    <div>
      <DocumentsPage docs= {docs}  customers={customers}/>
      
    </div>
  )
}

export default page
