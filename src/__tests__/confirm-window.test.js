// NOTE: jest-dom adds handy assertions to Jest and it is recommended, but not required.
import '@testing-library/jest-dom'

import {render, fireEvent, screen} from '@testing-library/svelte'
import { it, describe, expect } from 'vitest';

import ConfirmWindow from 'src/UI/ConfirmWindow.svelte'

/**
* @vitest-environment jsdom
*/

test('renders confirm window with correct body', async () => {
  let test
  render(ConfirmWindow, { body: "Test" })
  const heading = screen.getByText('Test')
  expect(heading).toBeInTheDocument()
})

test('confirm window accept and cancel callback works properly', async () => {
  let test, test2
  render(ConfirmWindow, { AcceptCallback: () => test = true, DestroyCallback: () => test2 = true})

  const button = screen.getByText('Yes')
  await fireEvent.click(button)

  expect(test).toBeTruthy()
  expect(test2).toBeTruthy()
})