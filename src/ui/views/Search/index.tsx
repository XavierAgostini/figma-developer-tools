import React, { useContext, useState, useEffect } from 'react'
import classNames from 'classnames'

import FigmaPageList from '../../components/FigmaPageList'
import { useDebounce } from '../../hooks/useDebounce'
import { FigmaAdjustIcon } from '../../components/FigmaIcons'
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css'
import { Select, Input, Title, Text, Button } from "react-figma-plugin-ds";
import { SelectedItemsListProvider  } from "../../context/SelectedItemsList"
import { FigmaPageFilter } from '../../types';

const Search = () => {
  const [query, setQuery] = useState<string>('')
  const [selectedPageFilter, setSelectedPageFilter] = useState<FigmaPageFilter>("ALL")
  const { figmaSearchResults, currentFigmaPage } = useContext(PluginMessageContext)
  const debouncedSearchTerm = useDebounce(query, 200);

  const onInputChange = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(value)
  }

  const onSelectedPageChange = (option: any) => {
    const pageId = option.value as FigmaPageFilter;
    setSelectedPageFilter(pageId)
  }
  const clearSearch = () => {
    setQuery('')
    let input = document.getElementsByClassName(style.input)[0] as HTMLInputElement
    input.value = '';
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
        <Input 
          icon="search"
          iconColor='black'
          placeholder='Search'
          className={style.input}
          onChange={onInputChange} 
        />
        <Select
          placeholder=''
          options={pageList.map(page => ({value: page.id, label: page.name}))}
          onChange={(e) => console.log('change',e)}
          onExpand={(e) => console.log('expand',e)}
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
        {numResults > 0 && (
          <SelectedItemsListProvider>
            <FigmaPageList pages={filteredPageResults}/>
          </SelectedItemsListProvider>
        )}
        {numResults === 0 && (
          <div className={style.noResults}>
            <Text size="xlarge">No results found</Text>
            {query.length > 0 && <Button onClick={clearSearch} isSecondary>Clear Search</Button>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search;