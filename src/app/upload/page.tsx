
import { getDocs } from '@/actions/document'
import Upload from '@/components/upload'
import React from 'react'

const page =async () => {

    const { docs, customers} = await getDocs()
  
    const names = customers.map((cust) => {
      return cust.name
    })
    const documents = [...new Set(docs.map((doc) => doc.type))];

  
  return (
    <div>
      <Upload customers={names} documents={ documents}/>
    </div>
  )
}

export default page
