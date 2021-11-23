/**
 * @jest-environment jsdom
 */

 import { screen } from "@testing-library/dom";
 import userEvent from '@testing-library/user-event'
 import BillsUI from "../views/BillsUI.js";
 import Bills from "../containers/Bills.js";
 import { bills } from "../fixtures/bills.js";
 import { ROUTES } from "../constants/routes"
 import firebase from "../__mocks__/firebase"
 import { localStorageMock } from "../__mocks__/localStorage.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    // SORT DATE
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByTestId('date-id').map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    });

    // Open modal on btn Click
    describe('When I click on the btn', () => {
      test('A modal should open', () => {
        const firestore = null
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const bills = new Bills({
          document, onNavigate, firestore, localStorage: window.localStorage
        })
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html

        const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill())

        const btn = screen.getByTestId('btn-new-bill')
        btn.addEventListener('click', handleClickNewBill)
        userEvent.click(btn)
        expect(handleClickNewBill).toHaveBeenCalled()
  
        const modaleBill = screen.getByTestId('form-new-bill')
        expect(modaleBill).toBeTruthy()
      })
    })

    // OPEN MODAL ON EYE ICON
    describe('When I click on the icon eye', () => {
      test('A modal should open', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const theBills = new Bills({
          document, onNavigate, firestore: null, localStorage: window.localStorage
        })

        jQuery.fn.extend({modal: function() {},});
    
        const handleClickIconEye = jest.fn(e => theBills.handleClickIconEye)
        const iconEye = screen.queryAllByTestId('icon-eye')

        iconEye[0].addEventListener('click', handleClickIconEye)
        userEvent.click(iconEye[0])
        expect(handleClickIconEye).toHaveBeenCalled()
        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeTruthy()
      })
    })

    // LOADING MESSAGE
    describe('When I am on Bill page but it is loading', () => {
      test('Then, Loading page should be rendered', () => {
        const html = BillsUI({ loading: true })
        document.body.innerHTML = html
        expect(screen.getAllByText('Loading...')).toBeTruthy()
      })
    })

    // ERROR
    describe('When I am on bill page but back-end send an error message', () => {
      test('Then, Error page should be rendered', () => {
        const html = BillsUI({ error: 'some error message' })
        document.body.innerHTML = html
        expect(screen.getAllByText('Erreur')).toBeTruthy()
      })
    })

    // test d'intégration GET
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})


