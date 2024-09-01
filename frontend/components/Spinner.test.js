// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

import React from "react"
import { render, screen } from '@testing-library/react'
import Spinner from "./Spinner"

test('renders Spinner when ON prop is true ', () => {
  render(<Spinner on={true} />)
  expect(screen.getByText("Please Wait...")).toBeInTheDocument()
})

test('renders Spinner when ON prop is false ', () => {
  render(<Spinner on={true} />)
  expect(screen.queryByText("Please Wait...")).toBeNull()
})

