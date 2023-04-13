import React, { useContext, useState, useEffect } from 'react'
// import FigmaItemList from '../../components/FigmaItemList'
import FigmaPageList from '../../components/FigmaPageList'
import { useDebounce } from '../../hooks/useDebounce'
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css'
// @ts-ignore
// import { selectMenu} from "../../../../node_modules/figma-plugin-ds/dist/iife/figma-plugin-ds.js"
// import { selectMenu } from 'figma-plugin-ds';
import { Select, Input, Title, Text } from "react-figma-plugin-ds";
import { SelectedItemsListProvider  } from "../../context/SelectedItemsList"
import { FigmaPageFilter } from '../../types';
import classNames from 'classnames'

// type PageIdMap = {[key: string]: FigmaNode['page']}

const Search = () => {
  const [query, setQuery] = useState<string>('')
  const [selectedPageFilter, setSelectedPageFilter] = useState<FigmaPageFilter>("ALL")
  const { figmaSearchResults, currentFigmaPage } = useContext(PluginMessageContext)
  const debouncedSearchTerm = useDebounce(query, 200);

  const onInputChange = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(value)
  }

  const onSelectedPageChange = (option: any) => {
    // const pageId = e.target.value as FigmaPageFilter;
    const pageId = option.value as FigmaPageFilter;
    setSelectedPageFilter(pageId)
  }

  useEffect(function onDebouncedQueryChange () {
    window.parent.postMessage({ pluginMessage: { type: 'figma-search', data: { query: debouncedSearchTerm} } }, '*')
  }, [debouncedSearchTerm])
  useEffect(function getIntialFigmaPage () {
    window.parent.postMessage({ pluginMessage: { type: 'get-current-page' } }, '*')
  }, [])

  const pageList = [
    { id: 'CURRENT', name: 'This Page'},
    { id: 'ALL', name: 'All Pages'},
  ]

  const filteredPageResults = figmaSearchResults.filter(page => {
    if (selectedPageFilter === 'ALL') {
      return true
    }
    else if (selectedPageFilter === 'CURRENT') {
      return page.page.id === currentFigmaPage?.id
    }
    return false
  });

  const numResults = filteredPageResults.reduce((acc, page) => {
    return acc + page.nodes.length
  }, 0)
  return (
    <div className={style.container}>
      <div className={style.header}>
        <Title size='xlarge'>Search Figma</Title>
        <Input 
          icon="search"
          iconColor='black'
          placeholder='Search'
          className={style.input}
          onChange={onInputChange} 
        />
      </div>
     
      <div className={style.body}>
        <div className={style.pageResultsInfo}>
          <Title size='small'>{numResults} Result{numResults > 1 || numResults === 0 ? 's' : ''} </Title>
          <Select
            placeholder=''
            className={classNames(["select-menu", style.selectMenu])}
            defaultValue={"ALL"}
            // className='select-menu'
            // value={selectedPageFilter}
            options={pageList.map(page => ({value: page.id, label: page.name}))}
           
            onChange={onSelectedPageChange}
            // @ts-ignore
            // onClick={onSelectedPageChange}
          />
        </div>
        {filteredPageResults.length > 0 && (
          <SelectedItemsListProvider>
            <FigmaPageList pages={filteredPageResults}/>
          </SelectedItemsListProvider>
        )}
        {filteredPageResults.length === 0 && (
          <div className={style.noResults}>
            <Text size="xlarge">No results</Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search;