import React, { useContext, useState, useEffect } from 'react'
import FigmaItem from '../../components/FigmaItem'
import { useDebounce } from '../../hooks/useDebounce'
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.css'

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
    <div>
      <h1>Search Figma Nodes</h1>
      <input 
        type="text"
        placeholder='Search'
        value={query}
        onChange={onInputChange} 
      />
      <div>
        <h2>Results</h2>
        {figmaSearchResults.map((node) => {
          return (
            <FigmaItem key={node.id} node={node}/>
          )
        })}
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