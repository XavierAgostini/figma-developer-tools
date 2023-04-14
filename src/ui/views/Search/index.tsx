import React from 'react'
import classNames from 'classnames'
import SearchFilterDropdown from '../../components/SearchFilterDropdown'
import FigmaPageList from '../../components/FigmaPageList'
import style from './style.module.css'
import { Select, Input, Title, Text, Button } from "react-figma-plugin-ds";
import { SelectedItemsListProvider  } from "../../context/SelectedItemsList"
import { useFigmaSearch } from './useFigmaSearch'
import SearchInput from '../../components/SearchInput'
const PAGE_FILTER_LIST = [
  { id: 'CURRENT', name: 'This Page'},
  { id: 'ALL', name: 'All Pages'},
]

const Search = () => {
  const {
    query,
    filteredNodeResults,
    filterMenuOptions,
    resultsByNodeType,
    numResults,
    selectedOptionMap,
    selectedFilterOptions,
    searchInputRef,
    setSelectedFilterOptions,
    handleSelectFilterOption,
    onInputChange,
    clearSearch,
    onSelectedPageChange, 
  } = useFigmaSearch()
  
  return (
    <div className={style.container}>
      <div className={style.header}>
        <SearchInput
          placeholder="Search"
          onChange={onInputChange} 
          searchInputRef={searchInputRef}
        />
        <SearchFilterDropdown
          filterMenuOptions={filterMenuOptions}
          handleSelectFilterOption={handleSelectFilterOption}
          selectedOptionMap={selectedOptionMap}
          selectedFilterOptions={selectedFilterOptions}
          setSelectedFilterOptions={setSelectedFilterOptions}
          resultsByNodeType={resultsByNodeType}
        />
      </div>
      <div className={style.body}>
        <div className={style.pageResultsInfo}>
          <Title size='small'>{numResults} Result{numResults > 1 || numResults === 0 ? 's' : ''} </Title>
          <Select
            placeholder=''
            className={classNames(["select-menu", style.selectMenu])}
            defaultValue={"ALL"}
            options={PAGE_FILTER_LIST.map(page => ({value: page.id, label: page.name}))}
            onChange={onSelectedPageChange}
          />
        </div>
        {numResults > 0 && (
          <SelectedItemsListProvider>
            <FigmaPageList pages={filteredNodeResults} />
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