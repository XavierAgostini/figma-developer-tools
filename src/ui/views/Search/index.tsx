import React, { useContext, useState, useEffect } from 'react'
import FigmaItemList from '../../components/FigmaItemList'
import { useDebounce } from '../../hooks/useDebounce'
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css'

const Search = () => {
  const [query, setQuery] = useState<string>('')

  const { figmaSearchResults } = useContext(PluginMessageContext)
  const debouncedSearchTerm = useDebounce(query, 200);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  useEffect(function onDebouncedQueryChange () {
    window.parent.postMessage({ pluginMessage: { type: 'figma-search', data: { query: debouncedSearchTerm} } }, '*')
  }, [debouncedSearchTerm])

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>Search Figma Node</div>
        <input 
          type="text"
          placeholder='Search'
          value={query}
          onChange={onInputChange} 
        />
      </div>
     
      <div className={style.body}>
        {figmaSearchResults.length > 0 && (
          <FigmaItemList nodes={figmaSearchResults}/>
        )}
        {figmaSearchResults.length === 0 && (
          <div>
            <p>No results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search;