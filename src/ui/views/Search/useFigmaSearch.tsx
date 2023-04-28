import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { useDebounce } from '../../hooks/useDebounce'
import { PluginMessageContext } from '../../context/PluginMessages'
import { FigmaPageFilter, SelectOption } from '../../types';
import  { ActionMeta, MultiValue } from 'react-select';

const SHAPE_TYPES = ['RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'VECTOR', 'LINE'];

import { FigmaComponentIcon, FigmaFrameIcon, FigmaImageIcon, FigmaInstanceIcon, FigmaShapeIcon, FigmaTextIcon, FigmaEllipseIcon, FimgaAllIcon } from '../../components/FigmaIcons';

const SEARCH_OPTIONS = ['text_value_search', 'layer_name_search'];

const baseOptions: SelectOption[] = [
  { value: 'all', label: 'All', icon: <FimgaAllIcon/>, count: 0, isSelected: true },
  { value: 'frame_and_group', label: 'Frame / Group', icon: <FigmaFrameIcon/>, count: 0, isSelected: false},
  { value: 'text', label: 'Text', icon: <FigmaTextIcon/>, count: 0, isSelected: false },
  { value: 'component', label: 'Component', icon: <FigmaComponentIcon/>, count: 0, isSelected: false},
  { value: 'instance', label: 'Instance', icon: <FigmaInstanceIcon/>, count: 0, isSelected: false},
  { value: 'image', label: 'Image', icon: <FigmaImageIcon/>, count: 0, isSelected: false},
  { value: 'shape', label: 'Shape', icon: <FigmaShapeIcon/> , count: 0, isSelected: false},
  { value: 'other', label: 'Other', icon: <FigmaEllipseIcon/>, count: 0, isSelected: false },
  { value: 'divider', label: 'divider', icon: null, isSelected: false },
  { value: 'layer_name_search', label: 'Layer Name', icon: <FimgaAllIcon/>, isSelected: true },
  { value: 'text_value_search', label: 'Text', icon: <FigmaTextIcon/>, isSelected: true },
];

export const useFigmaSearch = () => {
  const [query, setQuery] = useState<string>('')
  const [selectedPageFilter, setSelectedPageFilter] = useState<FigmaPageFilter>("ALL")
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<SelectOption[]>(baseOptions.filter(option => option.isSelected));

  const { figmaSearchResults, currentFigmaPage } = useContext(PluginMessageContext)

  const debouncedSearchTerm = useDebounce(query, 20);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOptionMap = selectedFilterOptions.reduce((acc, option) => {
    acc[option.value] = true;
    return acc;
  }, {} as {[key: string]: boolean}); 


  const handleSelectFilterOption = (options: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {    
    let formatedNodeOptions = options.filter(option => !SEARCH_OPTIONS.includes(option.value)).map((option) => {
      return { ...option, isSelected: true }
    })

    if (formatedNodeOptions.length > 1) {
      if (selectedOptionMap['all']) {
        formatedNodeOptions = formatedNodeOptions.filter(option => option.value !== 'all');
      }
      else {
        const allOptionSelected = formatedNodeOptions.some(option => option.value === 'all');
        if (allOptionSelected) {
          formatedNodeOptions = formatedNodeOptions.filter(option => option.value === 'all');
        }
      }
    }
    if (formatedNodeOptions.length === 0) {
      formatedNodeOptions = baseOptions.filter(option => option.value === 'all').map((option) => {
        return { ...option, isSelected: true }
      })
    }

    let formatedSearchOptions = options.filter(option => SEARCH_OPTIONS.includes(option.value)).map((option) => {
      return { ...option, isSelected: true }
    })

    // Ensure at least one search option is selected
    if (formatedSearchOptions.length == 1) {
      if (formatedSearchOptions[0].value === 'layer_name_search' && selectedOptionMap['text_value_search'] && selectedOptionMap['layer_name_search']) {
        formatedSearchOptions = formatedSearchOptions.filter(option => option.value !== 'text_value_search');
      }
      if (formatedSearchOptions[0].value === 'text_value_search' && selectedOptionMap['layer_name_search'] && selectedOptionMap['text_value_search'] ) {
        formatedSearchOptions = formatedSearchOptions.filter(option => option.value !== 'layer_name_search');
      }
    }
    if (formatedSearchOptions.length === 0) {
      formatedSearchOptions = baseOptions.filter(option => option.value === 'layer_name_search').map((option) => {
        return { ...option, isSelected: true }
      })
    }
   
    const allOptions = [...formatedNodeOptions, ...formatedSearchOptions];
    setSelectedFilterOptions(allOptions);
  };

  // Filters search results by selected page filter: ALL, CURRENT
  const filteredPageResults = useMemo(() => {
    return figmaSearchResults.filter(page => {
      if (selectedPageFilter === 'ALL') {
        return true
      }
      else if (selectedPageFilter === 'CURRENT') {
        return page.page.id === currentFigmaPage?.id
      }
      return false
    })
   
  }, [figmaSearchResults, selectedPageFilter, selectedOptionMap]);

  // Filters 'filteredPageResults' results by selected node filter: ALL, TEXT, FRAME, COMPONENT, INSTANCE, IMAGE, SHAPE, OTHER
  const filteredNodeResults = useMemo(() => {
    return filteredPageResults.map(page => {
      if (selectedOptionMap['all']) {
        return page;
      }
      const filteredNodes = page.nodes.filter(node => {
        if (node.type === "TEXT") {
          return selectedOptionMap['text']
        }
        if (node.type === "FRAME" || node.type === "GROUP") {
          // return true;
          return selectedOptionMap['frame_and_group']
        }
        if (node.type === "COMPONENT") {
          return selectedOptionMap['component']
        }
        if (node.type === "INSTANCE") {
          return selectedOptionMap['instance']
        }
        if (node.type === "IMAGE") {
          return selectedOptionMap['image']
        }
        if (SHAPE_TYPES.includes(node.type)) {
          return selectedOptionMap['shape']
        }
        return selectedOptionMap['other']
      })

      return {
        ...page,
        nodes: filteredNodes
      }
    })
  }, [filteredPageResults, selectedOptionMap])

  // returns a map of search results by node type and their occurrence count
  const resultsByNodeType =  useMemo(() => {
    return filteredPageResults.reduce((acc, page) => {
      page.nodes.forEach(node => {
        acc['all'] = (acc['all'] || 0) + 1
        const type = node.type
        switch (type) {
          case 'INSTANCE':
            acc['instance'] = (acc['instance'] || 0) + 1
            break
          case 'COMPONENT':
            acc['component'] = (acc['component'] || 0) + 1
            break
          case 'FRAME':
            acc['frame_and_group'] = (acc['frame_and_group'] || 0) + 1
            break
          case 'GROUP':
            acc['frame_and_group'] = (acc['frame_and_group'] || 0) + 1
            break
          case 'TEXT':
            acc['text'] = (acc['text'] || 0) + 1
            break
          case 'VECTOR':
            acc['shape'] = (acc['shape'] || 0) + 1
            break
          case 'IMAGE':
            acc['image'] = (acc['image'] || 0) + 1
            break
          case 'RECTANGLE':
            acc['shape'] = (acc['shape'] || 0) + 1
            break
          case 'ELLIPSE':
            acc['shape'] = (acc['shape'] || 0) + 1
            break
          case 'POLYGON':
            acc['shape'] = (acc['shape'] || 0) + 1
            break
          case 'LINE':
            acc['shape'] = (acc['shape'] || 0) + 1
            break
          case 'STAR':
            acc['shape'] = (acc['shape'] || 0) + 1
            break
          case 'SLICE':
            acc['other'] = (acc['other'] || 0) + 1
            break
          default:
            acc['other'] = (acc['other'] || 0) + 1
            break
        }
      })
      return acc
    }, {} as {[key: string]: number})
  }, [filteredPageResults])

  // returns the total number of search results 
  const numResults = filteredNodeResults.reduce((acc, page) => {
    return acc + page.nodes.length
  }, 0)
 
  const filterMenuOptions: SelectOption[] = baseOptions.map((option) => {
    const isSelected = selectedOptionMap[option.value];
    const count = !SEARCH_OPTIONS.includes(option.value) ? resultsByNodeType[option.value] || 0 : undefined;
    return {
      ...option,
      count,
      isSelected,
    }
  });

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const onSelectedPageChange = (option: any) => {
    const pageId = option.value as FigmaPageFilter;
    setSelectedPageFilter(pageId)
  }

  const clearSearch = () => {
    setQuery('')
    if (searchInputRef?.current) {
      searchInputRef.current.value = ''
    }
  }
  useEffect(function onDebouncedQueryChange () {
    window.parent.postMessage({ pluginMessage: { type: 'figma-search', data: { query: debouncedSearchTerm, layerNameFilterEnabled: selectedOptionMap['layer_name_search'] , textValueFilterEnabled: selectedOptionMap['text_value_search'] } } }, '*')
  }, [debouncedSearchTerm, selectedOptionMap])

  useEffect(function getIntialFigmaPage () {
    window.parent.postMessage({ pluginMessage: { type: 'get-current-page' } }, '*')
  }, [])

  return {
    query,
    filteredPageResults,
    filteredNodeResults,
    resultsByNodeType,
    numResults,
    selectedOptionMap,
    filterMenuOptions,
    selectedFilterOptions,
    searchInputRef,
    setSelectedFilterOptions,
    handleSelectFilterOption,
    onInputChange,
    clearSearch,
    onSelectedPageChange, 
  }
}