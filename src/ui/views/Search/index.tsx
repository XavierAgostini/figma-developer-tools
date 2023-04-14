import React from 'react'
import classNames from 'classnames'
import SearchFilterDropdown from '../../components/SearchFilterDropdown'
import FigmaPageList from '../../components/FigmaPageList'
import { Tooltip } from 'react-tooltip'


import 'react-tooltip/dist/react-tooltip.css'

import { Select, Title, Text, Button } from "react-figma-plugin-ds";
import { SelectedItemsListProvider  } from "../../context/SelectedItemsList"
import { useFigmaSearch } from './useFigmaSearch'
import SearchInput from '../../components/SearchInput'

import style from './style.module.css'
import { FigmaHelpIcon } from '../../components/FigmaIcons'

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
        <div className={style.tooltipWrapper}>
          <FigmaHelpIcon className={style.helpIcon} data-tooltip-id="search-help" />
          <Tooltip id="search-help" place="bottom" className={style.tooltip} >
            <div className={style.tooltipContent}>
              <div className={style.tooltipGroup}>
                <div className={style.tooltipTitle}>Search</div>
                <div className={style.tooltipText}>
                  <ul>
                    <li>Layer Name</li>
                    <li>Text Value</li>
                    <li>
                      <div>Figma Node Id: </div>
                      <div>i.e "id="0:1"</div>
                      </li>
                  </ul>
              </div>
              <div className={style.tooltipGroup}>
                <div className={style.tooltipTitle}>Filter</div>
                <div className={style.tooltipText}>
                  <ul>
                    <li>Layer Type</li>
                    <li>Page</li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
          </Tooltip>
        </div>
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