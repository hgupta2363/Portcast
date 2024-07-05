import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getCurrencyDetails } from '../apiService'
import useDataLoader from '../customHooks/useDataLoader'
import { CurrencyData } from '../schema/currency'
import './CurrencyDetails.css'

export default function CurrencyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fetchCurrencyDetails = async (signal: AbortSignal) => {
    if (id) {
      const responseData = await getCurrencyDetails(signal, id)
      return responseData.data
    } else {
      throw new Error('id param is not there')
    }
  }
  const { data, loading, error } = useDataLoader<CurrencyData>(
    fetchCurrencyDetails,
    false,
  )
  console.log(data)

  if (error) {
    return <div>Error: {error}</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <button onClick={() => navigate('/')} className="black-button">
        back
      </button>
      <div className="currency-details-card" key={data?.id ?? ''}>
        <h3>{data?.name ?? ''}</h3>
        <p>Symbol: {data?.symbol ?? ''}</p>
        <p>Market Cap (USD): {data?.marketCapUsd ?? ''}</p>
        <p>Price (USD): {data?.priceUsd ?? ''}</p>
      </div>
    </>
  )
}
