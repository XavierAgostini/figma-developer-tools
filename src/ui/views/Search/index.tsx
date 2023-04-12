import React, { useContext, useState, useEffect } from 'react'
// import FigmaItemList from '../../components/FigmaItemList'
import FigmaPageList from '../../components/FigmaPageList'
import { useDebounce } from '../../hooks/useDebounce'
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css'
// @ts-ignore
// import { selectMenu} from "../../../../node_modules/figma-plugin-ds/dist/iife/figma-plugin-ds.js"
import { selectMenu } from 'figma-plugin-ds';
import classNames from 'classnames'


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

  selectMenu.init()
  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>Search Figma Node</div>
        <input 
          type="text"
          placeholder='Search'
          className='input__field'
          value={query}
          onChange={onInputChange} 
        />
      </div>
     
      <div className={style.body}>
        <div className={style.pageResultsInfo}>
          <span>10 Results - This Page</span>
          <select
            className={classNames({
              "select-menu": true,
              [style.selectMenu]: true
            })}
          >
            <option value="1" >Item 1</option>
            <option value="2" >Item 2</option>
            <option value="3" >Item 3</option>
          </select>
        </div>
        {figmaSearchResults.length > 0 && (
          <FigmaPageList nodes={figmaSearchResults}/>
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