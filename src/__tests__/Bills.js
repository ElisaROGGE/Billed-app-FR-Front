/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from '../containers/Bills.js'
import $ from 'jquery';

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    let component;

  beforeEach(() => {
    component = new Bills({
      document,
      onNavigate: jest.fn(),
      store: {
        bills: jest.fn(() => ({
          list: jest.fn(() => Promise.resolve([bills])),
        })),
      },
      localStorage: window.localStorage,
    });
  });
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon).toBeDefined();
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", async () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    test('handleClickNewBill', () => {
      component.getBills = jest.fn();
      fireEvent.click(screen.getByTestId('btn-new-bill'));
      expect(component.onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });
    test('handleClickIconEye', async () => {
      $.fn.modal = jest.fn();
      component.getBills = jest.fn();
      const iconEyes = screen.getAllByTestId('icon-eye');
      expect(iconEyes.length).toBeGreaterThan(0);
      fireEvent.click(iconEyes[0]);
    });
    test("Then return unformatted date, if corrupted data was introduced", () => {
      const corruptedBills = [{
        "status": "refused",
        "date": "unformatted date"
      }];
      const storeMock = {
        bills: () => {
          return {
            list: () => {
              return {
                then: (fn) => fn(corruptedBills),
              };
            },
          };
        },
      };
      const billsObject = new Bills({
        document,
        onNavigate: {},
        store: storeMock,
        localStorage: {},
      });
      const testBillsError = billsObject.getBills();
      const expectedBillsError = [{ status: 'Refused', date: 'unformatted date' }];
      expect(testBillsError).toEqual(expectedBillsError);
    });
  });
})
