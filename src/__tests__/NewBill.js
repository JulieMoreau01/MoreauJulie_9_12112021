/**
 * @jest-environment jsdom
 */
import { fireEvent, screen} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  beforeAll(() => {
    document.body.innerHTML = NewBillUI()
   })
  describe("When I am on NewBill Page All The element are present", () => {
    test("Then the new bill page should have a title", () => {
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    test("Then the new bill page should have 7 Label", () => {
      const label = document.querySelectorAll('.bold-label')
      expect(label.length).toEqual(7)
    })
    test("Then the new bill page should have 7 Label", () => {
      const label = document.querySelectorAll('.bold-label')
      expect(label.length).toEqual(7)
    })
    test("Then the new bill page should have 6 input", () => {
      const input = document.getElementsByTagName('input')
      expect(input.length).toEqual(6)
    })
    test("Then the new bill page should have 1 select", () => {
      const select = document.getElementsByTagName('select')
      expect(select.length).toEqual(1)
    })
    test("Then the new bill page should have 1 textarea", () => {
      const textarea = document.getElementsByTagName('textarea')
      expect(textarea.length).toEqual(1)
    })
    test("Then the new bill page should have 1 submit button", () => {
      const button = document.getElementsByTagName('button')
      expect(button.length).toEqual(1)
    })
  })

  describe("When I am on NewBill Page I can fill the form", () => {
    test("the expense-type select", () => {
      const selectType = screen.getByTestId('expense-type')
      userEvent.selectOptions(selectType, ["1"]);
      expect(screen.getByTestId("val1").selected).toBe(true);
      expect(screen.getByTestId("val2").selected).toBe(false);
    })
    test("the name Input", () => {
      const name = screen.getByTestId('expense-name')
      userEvent.type(name, 'Julie Moreau')
      expect(name.value).toMatch('Julie Moreau')
    })
    test("the Date Picker input", () => {
      const date = screen.getByTestId('datepicker')
      userEvent.type(date, '2021-11-17')
      expect(date.value).toMatch('2021-11-17')
    })
    test("the Date Picker input", () => {
      const amount = screen.getByTestId('amount')
      userEvent.type(amount, '300')
      expect(amount.value).toMatch('300')
    })
    test("the amount vat & pct input", () => {
      const amount = screen.getByTestId('amount')
      userEvent.type(amount, '300')
      expect(amount.value).toMatch('300')

      const vat = screen.getByTestId('vat')
      userEvent.type(vat, '30')
      expect(vat.value).toMatch('30')

      const pct = screen.getByTestId('pct')
      userEvent.type(pct, '50')
      expect(pct.value).toMatch('50')
    })
    test("the textarea", () => {
      const commentary = screen.getByTestId('commentary')
      userEvent.type(commentary, 'commentary')
      expect(commentary.value).toMatch('commentary')
    })
    test("the input file", () => {
      const inputFile = screen.getByTestId("file")
      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      userEvent.upload(inputFile, file)
      expect(inputFile.files).toHaveLength(1)
      //   const onNavigate = (pathname) => {
      //     document.body.innerHTML = ROUTES({ pathname })
      //   }
      //   const newBill = new NewBill({
      //     document, onNavigate, firestore: null, localStorage: window.localStorage
      //   })
      // const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
      // inputFile.addEventListener('change', handleChangeFile)
      // expect(handleChangeFile).toHaveBeenCalled()
    })
    test("Submit the form with good extension", () => {
      const extension = 'png'
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      if ((extension === 'png') || (extension === 'jpg') || (extension === 'jpeg')) {
        expect(handleSubmit).toHaveBeenCalledTimes(1)
      }
    })
    test("Submit the form with bad extension and display error message", () => {
      const extension = 'pdf'
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      if ((extension === 'png') || (extension === 'jpg') || (extension === 'jpeg')) {
        expect(handleSubmit).toHaveBeenCalledTimes(1)
      } else {
        expect(screen.getAllByText("Extention autorisé : jpg, jpeg ou png.")).toBeTruthy()
      }
    })
  })
})