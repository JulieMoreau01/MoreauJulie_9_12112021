/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import firestore from "../app/Firestore.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { bills } from "../fixtures/bills"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the new bill page should have a title", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    test("Then the new bill page should have 7 Label", () => {
      document.body.innerHTML = NewBillUI()
      const label = document.querySelectorAll('.bold-label')
      expect(label.length).toEqual(7)
    })
    test("Then the new bill page should have 7 Label", () => {
      document.body.innerHTML = NewBillUI()
      const label = document.querySelectorAll('.bold-label')
      expect(label.length).toEqual(7)
    })
    test("Then the new bill page should have 6 input", () => {
      document.body.innerHTML = NewBillUI()
      const input = document.getElementsByTagName('input')
      expect(input.length).toEqual(6)
    })
    test("Then the new bill page should have 1 select", () => {
      document.body.innerHTML = NewBillUI()
      const select = document.getElementsByTagName('select')
      expect(select.length).toEqual(1)
    })
    test("Then the new bill page should have 1 textarea", () => {
      document.body.innerHTML = NewBillUI()
      const textarea = document.getElementsByTagName('textarea')
      expect(textarea.length).toEqual(1)
    })
    test("Then the new bill page should have 1 submit button", () => {
      document.body.innerHTML = NewBillUI()
      const button = document.getElementsByTagName('button')
      expect(button.length).toEqual(1)
    })

    test("Then put something in the input Nom de la dépense", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const bill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })          
      const html = NewBillUI()
   
      document.body.innerHTML = html

      const selectType = screen.getByTestId('expense-type')
      userEvent.selectOptions(selectType, ["1"]);
      expect(screen.getByTestId("val1").selected).toBe(true);
      expect(screen.getByTestId("val2").selected).toBe(false);

      const name = screen.getByTestId('expense-name')
      userEvent.type(name, 'Julie Moreau')
      expect(name.value).toMatch('Julie Moreau')

      const date = screen.getByTestId('datepicker')
      userEvent.type(date, '2021-11-17')
      expect(date.value).toMatch('2021-11-17')

      const amount = screen.getByTestId('amount')
      userEvent.type(amount, '300')
      expect(amount.value).toMatch('300')

      const vat = screen.getByTestId('vat')
      userEvent.type(vat, '30')
      expect(vat.value).toMatch('30')

      const pct = screen.getByTestId('pct')
      userEvent.type(pct, '50')
      expect(pct.value).toMatch('50')

      const commentary = screen.getByTestId('commentary')
      userEvent.type(commentary, 'commentary')
      expect(commentary.value).toMatch('commentary')

      const inputFile = screen.getByTestId("file")
      const file = new File(['hello'], 'hello.pdf', { type: 'image/png' })
      userEvent.upload(inputFile, file)
      expect(inputFile.files).toHaveLength(1)

      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })
})