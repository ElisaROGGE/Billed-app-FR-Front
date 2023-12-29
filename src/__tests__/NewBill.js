import { localStorageMock } from "../__mocks__/localStorage";
import NewBill from "../containers/NewBill";
import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI";
import router from "../app/Router.js";
import { ROUTES } from "../constants/routes.js";
import mockStore from '../__mocks__/store.js'
import userEvent from "@testing-library/user-event";

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
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({
      document: document,
      onNavigate: onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    const file = screen.getByTestId("file")
    file.addEventListener("change", handleChangeFile);
    userEvent.upload(file, new File(["file"], "hello.txt", {type: "text/plain"}))
    expect(handleChangeFile).toHaveBeenCalled()
    // expect(file.value).toBe("hello.txt")
    expect(window.alert).toBeCalledWith("Type de fichier non pris en charge. Veuillez choisir un fichier jpg, jpeg ou png.");
  });
  it("should handle file change", async () => {
    document.body.innerHTML = NewBillUI();
    const newBill = new NewBill({
      document: document,
      onNavigate: onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
    const file = screen.getByTestId("file")
    file.addEventListener("change", handleChangeFile);
    const myFile = new File(["image"], "hello.jpg", {type: "image/jpg"})
    userEvent.upload(file, myFile)
    expect(handleChangeFile).toHaveBeenCalled()
    expect(file.files[0].name).toBe("hello.jpg")
    expect(file.files[0]).toStrictEqual(myFile)

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
    expect(form).toBeTruthy();

  });
});
