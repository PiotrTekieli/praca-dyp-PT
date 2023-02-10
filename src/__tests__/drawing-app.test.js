// NOTE: jest-dom adds handy assertions to Jest and it is recommended, but not required.
import '@testing-library/jest-dom'

import {render, fireEvent, screen, waitFor, act} from '@testing-library/svelte'
import { it, describe, expect } from 'vitest';

import DrawingApp from 'src/DrawingApp.svelte';

/**
* @vitest-environment jsdom
*/

test('renders the editor with correct body', async () => {
  render(DrawingApp)
  let text

  text = screen.getByText('Hard Brush')
  expect(text).toBeInTheDocument()

  text = screen.getByText('Illustration', { exact: false })
  expect(text).toBeInTheDocument()
})

test('keyboard shortcuts work properly', async () => {
  render(DrawingApp)

  await fireEvent.keyDown(window, {key: "E", code: "KeyE"})

  const text = screen.getByText('Hard Round Eraser')
  expect(text).toBeInTheDocument()
})