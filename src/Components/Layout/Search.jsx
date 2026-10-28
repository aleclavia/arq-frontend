import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputBase, Paper, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const Search = () => {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(keyword.trim() ? `/search/${encodeURIComponent(keyword.trim())}` : '/')
  }

  return (
    <Paper component="form" onSubmit={submit} className="search-box" elevation={0}>
      <InputBase
        sx={{ flex: 1 }}
        placeholder="SEARCH WHEELS, HEADSETS, HOTAS..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        inputProps={{ 'aria-label': 'search products' }}
      />
      <IconButton type="submit" aria-label="search"><SearchIcon /></IconButton>
    </Paper>
  )
}

export default Search
