import { localStorageMock } from "../__mocks__/localStorage";
import NewBill from "../containers/NewBill";
import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI";
import router from "../app/Router.js";
import { ROUTES } from "../constants/routes.js";
import mockStore from '../__mocks__/store.js'

const onNavigate = (pathname) => {
  window.location.innerHTML = ROUTES({ pathname });
};

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employe@test.ltd" }));
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
});

describe("NewBill", () => {
  it("should not handle file change", async () => {
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({
      document: document,
      onNavigate: onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    newBill.handleChangeFile({ preventDefault: () => true, target: {value: 'hello.txt'} })

  });
  it("should handle file change", async () => {
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({
      document: document,
      onNavigate: onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    newBill.handleChangeFile({ preventDefault: () => true, target: {value: 'hello.png'} })

  });
  it("should handle submit", async () => {
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({
      document: document,
      onNavigate: onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

    const form = screen.getByTestId("form-new-bill")
    form.addEventListener("submit", handleSubmit);
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalled();
    expect(form).toBeDefined();

  });
});
