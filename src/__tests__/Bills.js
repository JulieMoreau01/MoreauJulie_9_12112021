/**
 * @jest-environment jsdom
 */

 import { screen } from "@testing-library/dom";
 import userEvent from '@testing-library/user-event'
 import BillsUI from "../views/BillsUI.js";
 import Bills from "../containers/Bills.js";
 import { bills } from "../fixtures/bills.js";
 import { ROUTES } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    // Loading 
    test("The Loading Text is on page", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });

    // error message
    test("There is an error message", () => {
      const html = BillsUI({ error: "some error message" });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });

    // SORT DATE
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByTestId('date-id').map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    });

    // TEST INTEGRATION - Open modal on btn Click
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

    // TEST INTEGRATION - Open Document on icon click
    describe('When I click on eyes icon', () => {
      test('A document should open', () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const handleClickIconEye = jest.fn(bills.handleClickIconEye)
        const iconsEye = screen.getAllByTestId('icon-eye')
        iconsEye.forEach(eye => {
          eye.addEventListener('click', handleClickIconEye)
          userEvent.click(eye)
          expect(handleClickIconEye).toHaveBeenCalled()
          const modaleDoc = screen.getByTestId('modaleFile')
          expect(modaleDoc).toBeTruthy()
          const modalBody = modaleDoc.querySelectorAll('.modal-body')
          expect(modalBody).toBeTruthy()
          const modalShow = modaleDoc.querySelectorAll('.modal.fade.show')
          expect(modalShow).toBeTruthy()
        })
      })
    })
  })
})


