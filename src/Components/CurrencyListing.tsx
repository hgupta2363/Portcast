import { useState, useRef, useMemo, useEffect } from 'react'
import useDataLoader from '../customHooks/useDataLoader'
import { getCurrencyData } from '../apiService'
import './CurrencyListing.css'
import { useNavigate } from 'react-router-dom'
import { CurrencyColumns, CurrencyData } from '../schema/currency'
import { columnsData, sortingOptions } from '../constService'

/**
 * This method sort data based on selcted option.
 * @param data,currency data.
 * @param sortType, sorting type.
 * @returns, sorted currency data.
 */
const sortData = (data: CurrencyData[], sortType: number): CurrencyData[] => {
  switch (sortType) {
    case 0:
      return data
    case 1:
      return [...data].sort((a, b) => a.name.localeCompare(b.name))
    case 2:
      return [...data].sort((a, b) => b.name.localeCompare(a.name))
    case 3:
      return [...data].sort((a, b) => a.symbol.localeCompare(b.symbol))
    case 4:
      return [...data].sort((a, b) => b.symbol.localeCompare(a.symbol))
    default:
      return data
  }
}

const CurrencyListing: React.FC = (): JSX.Element => {
  const [selectedSortOption, setSelectedSortOption] = useState<number>(0)
  const [favoriteCurrencies, setFavoriteCurrencies] = useState<string[]>(
    JSON.parse(localStorage.getItem('fav') ?? '[]'),
  )
  // pagination related info
  const [page, setPage] = useState(1)
  const limitRef = useRef(10)
  const offset = useMemo(() => (page - 1) * limitRef.current, [page])
  const navigate = useNavigate()

  /**
   * This method fetch currency data.
   */
  const fetchCurrencyData = async (signal: AbortSignal) => {
    const responseData = await getCurrencyData(signal, limitRef.current, offset)
    return responseData.data
  }

  const { data, error, loading, reloadCallback } = useDataLoader<
    CurrencyData[]
  >(fetchCurrencyData, true, 20000, page)
  const sortedData = useMemo(() => sortData(data ?? [], selectedSortOption), [
    selectedSortOption,
    data,
  ])

  /**
   * This method will trigger when user toggle favorite currency. this will store toggled value in local storage.
   */
  useEffect(() => {
    localStorage.setItem('fav', JSON.stringify(favoriteCurrencies))
  }, [favoriteCurrencies])

  /**
   * This method render column headers.
   */
  const renderColumnHeader = (): React.ReactElement[] =>
    columnsData.map((colData: CurrencyColumns) => (
      <div className="tooltip" key={colData.key}>
        <div className="ellipsis">{colData.name}</div>
        <div className="tooltiptext">{colData.name}</div>
      </div>
    ))

  /**
   * This method navigate to currency details.
   * @param key, key
   * @param id
   */
  const onItemClick = (key: string, id: any) => {
    if (key === 'id') {
      navigate(`/currencies/${id}`)
    }
  }

  /**
   * This method has logic to rendering a singal currency row.
   * @param rowItem
   * @returns
   */
  const renderCurrency = (rowItem: CurrencyData): JSX.Element[] =>
    columnsData.map((colData: CurrencyColumns) => (
      <div
        onClick={() => onItemClick(colData.key, rowItem.id)}
        className={`tooltip ${
          colData.key == 'id' ? 'clickable color-green' : ''
        }`}
        key={colData.key + rowItem.id}
      >
        <div className="ellipsis">{rowItem[colData.key]}</div>
        <div className="tooltiptext">{rowItem[colData.key]}</div>
      </div>
    ))

  const isFavoriteCurrency = (currency: CurrencyData): boolean =>
    favoriteCurrencies.includes(currency.id)

  const toggleFavoriteCurrency = (currency: CurrencyData): void => {
    setFavoriteCurrencies((prevValues) =>
      isFavoriteCurrency(currency)
        ? prevValues.filter((currencyId) => currencyId !== currency.id)
        : [...prevValues, currency.id],
    )
  }

  const onPageNavigation = (isNext: boolean): void => {
    setPage((prev) => (isNext ? prev + 1 : prev > 1 ? prev - 1 : prev))
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="table-wrapper">
      {/* Table heading */}
      <div className="table-heading">
        <p>Currency List</p>
        <div className="actions-buttons">
          {/* Sorting Option */}

          <select
            id="currency-select"
            value={selectedSortOption}
            className="sort-dropdown"
            onChange={(e: { target: { value: any } }) =>
              setSelectedSortOption(Number(e.target.value))
            }
          >
            {sortingOptions.map((optionData) => (
              <option key={optionData.value} value={optionData.value}>
                {optionData.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => onPageNavigation(false)}
            className="action-button"
          >
            prev
          </button>
          <div style={{ display: 'flex', color: 'green' }}>
            {offset + 1}-{limitRef.current * page}
          </div>
          <button
            onClick={() => onPageNavigation(true)}
            className="action-button"
          >
            next
          </button>
        </div>
      </div>
      {/*table row heading */}
      <div className="row">
        {renderColumnHeader()}
        <div>Action</div>
      </div>
      {/*Table data */}
      {sortedData?.map((rowItem: CurrencyData) => (
        <div className="row" key={rowItem.id}>
          {renderCurrency(rowItem)}
          <button
            className="black-button"
            onClick={() => toggleFavoriteCurrency(rowItem)}
          >
            {isFavoriteCurrency(rowItem) ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
      ))}
    </div>
  )
}

export default CurrencyListing
