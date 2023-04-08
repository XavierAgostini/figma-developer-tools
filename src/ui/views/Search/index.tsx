import React, { useState, useEffect } from 'react'
import FigmaItem from '../../components/FigmaItem'
import { useDebounce } from '../../hooks/useDebounce'
import { FigmaNode } from '../../types'
import style from './style.css'

const Search = () => {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<FigmaNode[]>([])
  const debouncedSearchTerm = useDebounce(query, 200);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  useEffect(function onDebouncedQueryChange () {
    if (debouncedSearchTerm) {
      window.parent.postMessage({ pluginMessage: { type: 'figma-search', data: debouncedSearchTerm } }, '*')
    } else {
      setResults([])
    }
  }, [debouncedSearchTerm])

  useEffect(function onWindowMessage () {
    const handleWindowMessage = (event: any) => {
      if (event.data.pluginMessage.type === 'figma-search-response') {
        const nodes = event.data.pluginMessage.data;
        setResults(nodes)
      }
    }
    window.addEventListener('message', handleWindowMessage)
    return () => window.removeEventListener('message', handleWindowMessage)
  }, [])

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
        {results.map((node) => {
          return (
            <FigmaItem key={node.id} node={node}/>
          )
        })}
        {results.length === 0 && (
          <div>
            <p>No results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search;